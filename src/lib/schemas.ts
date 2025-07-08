import {z} from 'zod'



export const accountSchema = z.object({
    bankName: z.string().min(2, 'Name is required or too short'),
    accountName: z.string().min(3, 'Account Name is required or too short'),
    accountType: z.enum(['savings', 'current', 'virtual']).default('savings'),
    balance:z.string().min(0, 'Initial balance is required'),
    isDefault:z.boolean().default(false)
});

export const transactionSchema = z.object({
    type: z.enum(['credit','debit', 'loan', 'transfer']).default('credit'),
    description: z.string().optional().default('N/A'),
    category: z.string().min(2, 'Category is required'),
    amount:z.string().min(0, 'Amount is required'),
    occurredAt:z.date({required_error:'Date is required'}),
    accountId: z.string().min(2, 'AccountID is required')
}).superRefine((data, ctx) => {
    if (!data.category || !data.amount)
        ctx.addIssue({
            code:z.ZodIssueCode.custom,
            message:"Category/amount is invalid",
            path:['category', 'amount']
    });
});


export type LoanRecommendation = {
  id: string,
  accountId: string,
  status: 'Ready' | 'pending' 
  loanTenure: number;
  repaymentPlan: string;
  decisionNote: string;
  netIncome: number;
  recommendedLoanAmount: number;
  creditScore: number;
  evaluatedAt: string; // ISO format
};
