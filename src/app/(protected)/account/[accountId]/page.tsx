import React, { Suspense } from 'react'
import { getAccountWithTransactions } from '../../../../../actions/account';
import { notFound } from 'next/navigation';
import { BarLoader } from "react-spinners";
import { AccountChart } from '../_components/accountChart';
import Image from 'next/image';
import { TransactionTable } from '../_components/transactionsTable';

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
type AccountWithTransactions = {
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

const Accounts = async({params}: Props) => {
  const {accountId} = await params
  const accountData = await getAccountWithTransactions(accountId) as AccountWithTransactions;
  console.log(accountData)
  

 if (!accountData) {
    notFound();
  }

  const { ...account } = accountData;
  const transactions = accountData.transactions as Transaction[];
   function formatNumberWithCommas(value: number | string): string {
  const number = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(number)) return "0";
  return number.toLocaleString("en-US");
}

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl 
        bg-gradient-to-br from-blue-600 to-purple-600
        font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text capitalize">
            {account.bankName}
          </h1>
          <p className="text-muted-foreground">
            {account.accountType.charAt(0) + account.accountType.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold flex">
             <Image src='/naira.png' width={15} height={5} alt="expense"
                  className="
            font-extrabold tracking-tighter pr-0.5 text-transparent bg-clip-text capitalize"/>
            {formatNumberWithCommas((account.balance).toFixed(2))}
          </div>
          <p className="text-sm text-muted-foreground">
            {account._count.transactions} Transactions
          </p>
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