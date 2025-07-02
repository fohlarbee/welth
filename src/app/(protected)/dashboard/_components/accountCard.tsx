"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { PrismaAccount } from "../../../../../actions/dashboard";
import useFetch from "@/hooks/useFetch";
import { updateDefaultAccount } from "../../../../../actions/account";
import Image from "next/image";

export function AccountCard({ account }: {account: PrismaAccount}) {
  const { accountName, accountType, balance, id, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

// Use React.MouseEvent directly in the handler
const handleDefaultChange = async (
  event: React.MouseEvent<HTMLButtonElement | HTMLSpanElement | HTMLInputElement>
) => {
    event.preventDefault();

    if (isDefault) {
        toast.warning("You need atleast 1 default account");
        return;
    }

    await updateDefaultFn(id);
};

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
    }
  }, [updatedAccount]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative border-sidebar-border">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium capitalize">
            {accountName}
          </CardTitle>
          <Switch
            checked={isDefault}
            onClick={handleDefaultChange}
            disabled={updateDefaultLoading!}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex">
            <Image src='/naira.png' width={20} height={20} alt="naira"/> {parseFloat(balance.toString()).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {accountType.charAt(0) + accountType.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
            Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
            Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}