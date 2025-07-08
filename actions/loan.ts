"use server";
import { db } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { parsePDF } from "@/lib/parsePDF";
import { LoanRecommendation, transactionSchema } from "@/lib/schemas";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";
import { sendEmail } from "@/lib/sendEmail";
import { formatNumberWithCommas } from "@/app/(protected)/account/[accountId]/page";
import EmailTemplate from "../emails/template";
 const config = {
    responseMimeType: 'application/json',
    temperature: 0.2,
    // topP: 0.9,
    // topK: 40,
    // maxOutputTokens: 8192,

  };

const genAI = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY as string});


export async function loanRecommendation(url: string, accountId:string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    const newLoanApplication = await db.loanApplication.create({
        data:{
          userId,
          accountId,
          status:'pending',
          evaluatedAt:new Date()
        }
    });
    revalidatePath("/account/[accountId]/loan", 'layout');

    const text = await parsePDF(userId, url);



    const loanRecommendation = await annalyzeALoan(text);
    await db.loanApplication.update({
      where:{id:newLoanApplication.id},
      data:{
        accountId, 
        decisionNote:loanRecommendation.decisionNote, 
        loanTenure:loanRecommendation.loanTenure,
        repaymentPlan:loanRecommendation.repaymentPlan,
        creditScore:loanRecommendation.creditScore,
        recommendedLoanAmount:loanRecommendation.recommendedLoanAmount,
        netIncome:loanRecommendation.netIncome,
        status:'Ready'

      }
    });

    await sendEmail({
      to:user.email,
      subject:`Loan Recommendation is Reviewd with ${formatNumberWithCommas( loanRecommendation.recommendedLoanAmount)} loan amount`,
      component: EmailTemplate({
        type:'loanRecommendation-report',
        userName:user.name,
        data:{
          decisionNote:loanRecommendation.decisionNote, 
          loanTenure:loanRecommendation.loanTenure,
          repaymentPlan:loanRecommendation.repaymentPlan,
          creditScore:loanRecommendation.creditScore,
          recommendedLoanAmount:loanRecommendation.recommendedLoanAmount,
          netIncome:loanRecommendation.netIncome,
          evaluatedAt:new Date(),
        }
      })
    });
    revalidatePath("/account/[accountId]/loan", 'layout');

    
    return {loanRecommendation}
}

export async function getAccountAndLoanApplications(accountId:string) {
      const { userId } = await auth();
      if (!userId) throw new Error("Unauthorized");
    
      const user = await db.user.findUnique({
        where: { id: userId },
      });
    
      if (!user) throw new Error("User not found");
    
      const loanApplications = await db.loanApplication.findMany({
        where: {
          accountId: accountId,
          userId: user.id,
        },  
      });
    
      if (!loanApplications) return null;

    //   const serializedLoanApplications = accounts.map((a) => ({
    //   ...a,
    // }));


    
      return loanApplications; 
    }

    
 export async function deleteOrUpdateLoanApplication(loanApplicationId: string, accountId:string) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
        where: { id: userId },
        });

        if (!user) throw new Error("User not found");

        await db.$transaction(async (tx) => {
        // Delete transactions
        await tx.loanApplication.delete({
            where: {
            id: loanApplicationId,
            accountId,
            userId
            },
        });
        
        });

        revalidatePath("/account/[accoundId]/loan", 'page')

        return { success: true };
    } catch (error) {
        if (error instanceof Error)
        return { success: false, error: error.message };
    }
}

export async function annalyzeALoan(text: string){
  try {
        const model = "gemini-2.5-flash";  
       const prompt = `
        You are a financial AI expert in credit risk assessment.

        Based on the following bank transaction history, analyze 
        and return a loan recommendation as a valid JSON object in this exact format:

        {
          "loanTenure": number,               // in months
          "repaymentPlan": string,            // suggested repayment plan --> summary
          "decisionNote": string,             // explain the reasoning
          "netIncome": number,
          "recommendedLoanAmount": number,
          "creditScore": number,               // between 0 - 100
          "evaluatedAt": "ISO date string"
        }

        Only return the JSON object — no explanations, markdown, or extra text. 
        Base your decision strictly on the data provided.
        Bank statement: ${text}
        `;



        const result = await genAI.models.generateContent({
            contents:{
              role:'user',
              parts:[{text:prompt}]
            },
            model,
            config
        });

        const response = result.text;
        const  loanRecommendation: LoanRecommendation = 
        response ? JSON.parse(response.replace(/```json\n?|```/g, "").trim()) : {}
        console.log('loanRecommendation',loanRecommendation)
        return loanRecommendation;

  } catch (error) {
      console.error("Error annalyzing Bank Stament:", error);
      throw new Error("Error annalyzing Bank Stament");
    
  }
}

export async function scanBankStatement(text: string) {
try {
      const model = "gemini-2.5-flash";  
      const prompt = `
      You are a financial AI loan recommender and risk annalyst, 
      Extract valid financial transactions from the text below.

      Return only a JSON array like:
      [
        {
          "amount": number,
          "occurredAt": "ISO string",
          "description": "max 15 chars",
          "merchantName": "string",
          "category": "one of: housing, transportation, groceries, utilities, 
          entertainment, food, shopping, healthcare, education, personal, travel, 
          insurance, gifts, bills, other-expense",
          "type": "credit | debit | loan | transfer"
        }
      ]
      No text. No markdown. Only JSON. If none, return [].

      BANK STATEMENT:
      ${text}
      `;

    const result = await genAI.models.generateContent({
      contents:{
        role:'user',
        parts:[{text:prompt}],
        
      },
    
      model,
      config
    });

    const response = result.text;
    const cleanedText = response && response.length > 0 ? response.replace(/```json\n?|```/g, "").trim() : "";
    const transactions: z.infer<typeof transactionSchema>[] = JSON.parse(cleanedText) ?? [];
    
    return transactions;

  
} catch (error) {
  console.error("Error scanning Bank Stament:", error);
  throw new Error("Failed to scan Bank Stament ");
}
}
