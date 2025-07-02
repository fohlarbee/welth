"use server";

import { db } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";



export async function getAccountWithTransactions(accountId:string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { transactions: true },
      },
    },
    
  });

  if (!account) return null;

    const serializedAcc = {
      ...account,
        balance: account.balance.toNumber(),
        // transactions:account.transactions
      
    }

  return {
    ...serializedAcc,
  };
}

export async function bulkDeleteTransactions(transactionIds: string[], accountId:string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    // Get transactions to calculate balance changes
    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        // userId: user.id,
        accountId
        
      },
    });

    // Group transactions by account to update balances
    const accountBalanceChanges = transactions.reduce<Record<string, number>>((acc, transaction) => {
      const change =
        transaction.type === "debit" ///here is where you change to credit from debit
          ? transaction.amount
          : -transaction.amount;
      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    // Delete transactions and update account balances in a transaction
    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          // userId: user.id,
          accountId
        },
      });

      // Update account balances
      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    if (error instanceof Error)
      return { success: false, error: error.message };
  }
}

export async function updateDefaultAccount(accountId : string) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // First, unset any existing default account
    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: { isDefault: false },
    });

    // Then set the new default account
    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: { isDefault: true },
    });

      const serializedAcc = {
      ...account,
      balance: account.balance.toNumber(),
    };
    revalidatePath("/dashboard");
    return { success: true, data: serializedAcc };
  } catch (error) {
    if (error instanceof Error)
         return { success: false, error: error.message };
  }
}