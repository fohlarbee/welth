"use server";

import { db } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { accountSchema } from "@/lib/schemas";
import { z } from "zod";

import { Decimal } from "@prisma/client/runtime/library";

export type PrismaAccount = {
  bankName: string;
  accountName: string;
  accountType: "savings" | "current" | "virtual";
  balance: Decimal | number;
  isDefault: boolean;
  userId: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    transactions: number;
  };
};

// export const serializeAccount = (account: PrismaAccount) => {
//   const serialized = { ...account };
//   serialized.balance = account.balance;

//   return serialized;
// };
export async function createAccount(data: z.infer<typeof accountSchema>) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ msg: "Unauthorize" }, { status: 401 });

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user)
      return NextResponse.json({ msg: "user not found" }, { status: 401 });
    // console.log("data from create account server action", data);

    // Convert balance to float before saving
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) throw new Error("Invalid balance");

    const existingAcc = db.account.findMany({
      where: {
        userId: user.id,
      },
    });
    const defaultAcc = (await existingAcc).length === 0 ? true : data.isDefault;
    if (defaultAcc) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const newAcc = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: defaultAcc,
      },
    });
    const serializedAcc = {
      ...newAcc,
      balance: newAcc.balance.toNumber(),
    };

    revalidatePath("/dashboard");
    return { success: true, data: serializedAcc };
  } catch (error) {
    // console.log(error);
    throw new Error("Something went wrong", error!);
  }
}

export const getUserAccounts = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    });

    const serializedAccounts = accounts.map((a) => ({
      ...a,
      balance: a.balance.toNumber(),
    }));

    return { success: true, data: serializedAccounts };
  } catch (error) {
    console.log("error from getting use accounts", error);
    throw new Error("Failed to get user accounts");
  }
};
