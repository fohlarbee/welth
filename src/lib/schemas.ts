import {z} from 'zod'



export const accountSchema = z.object({
    bankName: z.string().min(2, 'Name is required or too short'),
    accountName: z.string().min(3, 'Account Name is required or too short'),
    accountType: z.enum(['savings', 'current', 'virtual']).default('savings'),
    balance:z.string().min(0, 'Initial balance is required'),
    isDefault:z.boolean().default(false)
});

