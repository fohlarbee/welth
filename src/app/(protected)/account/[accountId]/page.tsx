import React, { Suspense } from 'react'
import { getAccountWithTransactions } from '../../../../../actions/account';
import { notFound } from 'next/navigation';
import { BarLoader } from "react-spinners";
import { AccountChart } from '../_components/accountChart';
import { TransactionTable } from '../_components/transactionsTable';
import {  SparkleIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type Props = {
    params: Promise<{accountId: string}>
}
export type Transaction = {
  id: string;
  accountId: string;
  type: "credit" | "debit" | "loan" | "transfer";
  description?: string | null;
  category?: string | null;
  amount: number;
  occurredAt: Date;
  createdAt: Date;
};
export type AccountWithTransactions = {
  balance: number;
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  bankName: string;
  accountName: string;
  accountType: string;
  isDefault: boolean;
  transactions: Transaction[];
  _count: { transactions: number };
};

 export function formatNumberWithCommas(value: number | string): string {
      const number = typeof value === "string" ? parseFloat(value) : value;
      if (isNaN(number)) return "0";
      return number.toLocaleString("en-NG", {
        style:'currency',
        currency:'NGN'
      });
   }
const Accounts = async({params}: Props) => {
  const {accountId} = await params
  const accountData = await getAccountWithTransactions(accountId) as AccountWithTransactions;
  

 if (!accountData) {
    notFound();
  }
    
  const { ...account } = accountData;
  const transactions = accountData.transactions as Transaction[];
  

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div className='object-contain'>
          <h1 className="md:text-5xl text-2xl 
        bg-gradient-to-br from-blue-600 to-purple-600
        font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text capitalize">
            {account.bankName}
          </h1>
          <p className="text-muted-foreground">
            {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2 mt-auto mb-auto">
          <div className="text-lg md:text-2xl font-bold flex text-right justify-end">
            {formatNumberWithCommas((account.balance).toFixed(2))}
          </div>
          <p className="text-sm text-muted-foreground text-right">
            {account._count.transactions} Transactions
            
          </p>
          <TooltipProvider>
            <Tooltip >
              <TooltipTrigger className='cursor-pointer'>
                <Link href={`/account/${accountId}/loan`}>

                 <Badge
                    variant="secondary"
                    className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                  >
                    <SparkleIcon className="h-3 w-3" />
                  
                    Loan Recommendation with AI
                  </Badge>
                </Link>
                {/* <Button size={'icon'} variant='default'>
                    <BookAIcon/>
                </Button> */}
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate personalized Loan Recommendation and risk Management with AI based on 
                  your acount activity
                </p>
              </TooltipContent>
            </Tooltip>

          </TooltipProvider>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
      >
        <TransactionTable transactions={transactions} accountId={accountId} />
      </Suspense>
    </div>
  );
}

export default Accounts;



// accountData {
//   id: 'ed0a7aaf-7513-4ff3-8f8f-e8e40f757437',
//   userId: 'user_2zAwg5CyJzSZnBT1gNl66NPSRUW',
//   bankName: 'FirstBank',
//   accountName: 'Loan account',
//   accountType: 'virtual',
//   balance: 5000,
//   isDefault: false,
//   createdAt: 2025-07-01T15:53:01.637Z,
//   updatedAt: 2025-07-01T15:53:36.402Z,
//   transactions: [],
//   _count: { transactions: 0 }
// }