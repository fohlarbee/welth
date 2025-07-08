"use server";
import { db } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { revalidatePath } from "next/cache";
import { Transaction } from "@/generated/prisma";
import {GoogleGenAI} from "@google/genai";

  const config = {
    responseMimeType: 'application/json',
    temperature: 0.2,
    // topP: 0.9,
    // topK: 40,
    // maxOutputTokens: 8192,

  };

const genAI = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY as string});

export async function createTransaction(data: Omit<Transaction, 'id' | 'createdAt'>) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    // Get request data for ArcJet
    const req = await request();

    // Check rate limit
    const decision = await aj.protect(req, {
      userId,
      requested: 1, 
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id,
      },
    });

    if (!account) {
      throw new Error("Account not found");
    }

    // Calculate new balance
    const balanceChange = data.type === "debit" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    // Create transaction and update account balance
    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
        },
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance },
      });

      return newTransaction;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data:transaction };
  } catch (error) {
    if ( error instanceof Error){

        throw new Error(error.message);
    }
  }
}


export async function scanReceipt(text: string) {
  try {
    const model = "gemini-2.5-flash";  
    const prompt = `
      Analyze this text ${text} and extract the following information in JSON format:
      - Total amount (just the number --> the sum total of the items purchaed in the receipt)
      - occurredAt (in ISO format)
      - Description or items purchased (Short summary --> not more than 15 characters)
      - Merchant/store name (the store name)
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,
      food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      - type (any of these 'credit', 'debit', 'loan', 'transfer')
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "occurredAt": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string",
        "type":"string"
      }
      Make sure you only provide valid data from the receipt image provided. Do not hallucinate,
      i repeat, do not hallucinate, make sure you go through the text properly and indentify if it's a credit 
      or debit transaction
      If its not a recipt, return an empty object
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
    const cleanedText = response? response.replace(/```json\n?|```/g, "").trim() : "";
    

    try {
      const data = JSON.parse(cleanedText!);
      console.log('data',data)
      
        
      return {
        amount: data.amount ?? 0,
        occurredAt: new Date(data.occurredAt) ?? new Date(),
        description: data.description ? `${data.description}@ ${data.merchantName}` : '',
        category: data.category
          ? `${data.category.charAt(0).toUpperCase() + data.category.slice(1)}`
          : "",
        type: data.type ?? 'debit',
      };

    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      throw new Error("Invalid response format from Gemini");
    }
  } catch (error) {
    console.error("Error scanning receipt:", error);
    throw new Error("Failed to scan receipt");
  }
}

