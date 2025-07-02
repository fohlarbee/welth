"use client";
import React, { ReactNode, useState } from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer';
import { useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { z } from 'zod';
import { accountSchema } from "@/lib/schemas";
import useFetch from '@/hooks/useFetch';
import { createAccount } from '../../actions/dashboard';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';


const CreateAccountDrawer = ({children}:{children: ReactNode}) => {
  const [open, setOpen] = useState<boolean>(false);
  const {
    register, 
    handleSubmit, 
    formState:{errors}, 
    setValue, 
    reset,
    watch
  } = useForm({
    resolver:zodResolver(accountSchema),
    defaultValues:{
      bankName:'',
      accountName:'',
      accountType:'current',
      balance:'',
      isDefault:false
    }
  });
const { 
  data:newAcc,
  error,
  fn:createAccFn,
  loading:createAccLoading
} = useFetch(createAccount);

  const onSubmit = async (data: z.infer<typeof accountSchema>) => {

    await createAccFn(data);
  };

    React.useEffect(() => {
    if (newAcc) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAcc, reset]);

  React.useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
   <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className='px-4 pb-4'>
           <form 
           onSubmit={handleSubmit(onSubmit)}
            className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="bankName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Bank Name
              </label>
              <Input
                id="bankName"
                placeholder="e.g., UBA"
                className='mt-1'
                {...register("bankName")}
              />
              {errors.bankName && (
                <p className="text-sm text-red-500">{errors.bankName.message}</p>
              )}
            </div>

            {/* account Name */}
             <div className="space-y-2">
              <label
                htmlFor="accountName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Name
              </label>
              <Input
                id="accountName"
                placeholder="e.g., Summer Account"
                {...register("accountName")}
              />
              {errors.accountName && (
                <p className="text-sm text-red-500">{errors.accountName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="accountType"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("accountType", value as "current" | "savings" | "virtual")}
                defaultValue={watch("accountType")}
                
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select Account Type" />
                </SelectTrigger>
                <SelectContent 
                className='mt-1'>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                </SelectContent>
              </Select>
              {errors.accountType && (
                <p className="text-sm text-red-500">{errors.accountType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="balance"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                "
              >
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border-sidebar-border shadow-md p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1"
                disabled={createAccLoading!}
              >
               
                {createAccLoading ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
   </Drawer>
  )
}

export default CreateAccountDrawer