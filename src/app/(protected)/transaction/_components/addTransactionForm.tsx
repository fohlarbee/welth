"use client";
import { Account } from '@/generated/prisma'
import React from 'react'
import { Categories } from '@/data/categories';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '@/lib/schemas';
import useFetch from '@/hooks/useFetch';
import { createTransaction } from '../../../../../actions/transactions';
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import CreateAccountDrawer from '@/components/CreateAccountDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Loader2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { ReceiptScanner } from './receiptScanner';

interface AddTransactionProp {
   accounts:AccProp[],
   categories: Categories[] ,
   editMode: boolean
}
type AccProp = Omit<Account, 'balance'> & {
    _count: { transactions: number };
    balance: number;
};


const AddTransactionForm = ({accounts, categories, editMode}: AddTransactionProp) => {
  const router = useRouter();
  const {
    register,
    setValue,
    handleSubmit,
    formState:{errors},
    getValues,
    reset,
    watch
  }  = useForm({
    resolver:zodResolver(transactionSchema),
    defaultValues:{
      type: 'credit',
      amount:'',
      description:'',
      category:'',
      accountId:accounts.find((acc) => acc.isDefault)?.id
    }
  });

  const type = watch('type');
  const occurredAt = watch("occurredAt");

  const {
    loading:transactionLoading,
      data:transactionResult,
      fn:transactionFn,

  } = useFetch(createTransaction);

   const filteredCategories = React.useMemo(() => {
      return categories.filter((cat) => cat.type === type);
  }, [type, categories]);

  const onSubmit = async(data:z.infer< typeof transactionSchema>) => {
    const formData = {
      ...data,
      amount:parseFloat(data.amount)
    }
    transactionFn(formData);
  }

   React.useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode
          ? "Transaction updated successfully"
          : "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
    //eslint-disable-next-line
  }, [transactionResult, transactionLoading, editMode]);


  const handleScan = async (scannedData: Omit<z.infer<typeof transactionSchema>, 'accountId'>) => {
     if (scannedData) {
      console.log('scannedData', scannedData)
     setValue("amount", scannedData.amount.toString());
      setValue("occurredAt", new Date(scannedData.occurredAt));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      // setValue('type', 'debit', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
      const allowedTypes = ['credit', 'debit', 'loan', 'transfer'] as const;
      type TransactionType = typeof allowedTypes[number];
      function isTransactionType(value: unknown): value is TransactionType {
        return allowedTypes.includes(value as TransactionType);
      }

      if (isTransactionType(scannedData.type)) {
        setValue("type", scannedData.type);
      }
      setTimeout(() => {

        const categoryExists = categories.find(
              (c) =>  c.type === type
            );
            if (categoryExists) {
              setValue("category", scannedData.category, { shouldValidate: true });
        }
     }, 0)
      
     
      // toast.success("Receipt scanned successfully");
    }
  }
  // const testFn = (e: React.FormEvent<HTMLFormElement>) =>{
  //   e.preventDefault()
    
  //   console.log(filteredCategories)
  //   setValue('type', 'credit', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  //   setTimeout(() => {

  //     const categoryExists = categories.find(
  //           (c) =>  c.type === type
  //         );
  //         if (categoryExists) {
  //           setValue("category", 'investments', { shouldValidate: true });
  //         }
  //   }, 0)
  //     console.log(watch('category'), category)
  //   console.log(watch('type'), type)
  // }
    return (
    <form className='space-y-6 border-sidebar-border border shadow-md 
    px-6 py-8 rounded-md' onSubmit={() => handleSubmit(onSubmit)}>

        <ReceiptScanner onScanComplete={handleScan}/>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>Type</label>
          <Select
          onValueChange={(value:'debit' | 'credit'| 'loan' | 'transfer') => setValue('type', value)}
          value={watch('type')}
          >
            <SelectTrigger
              className='mt-1'
              
            >
              <SelectValue   placeholder='Transaction type'/>
            </SelectTrigger>
            <SelectContent className='border-sidebar-border'>
                <SelectItem
                 className='text-red-600'
                 value='debit'>Debit</SelectItem>
                 <SelectSeparator/>

                <SelectItem
               
                 value='credit'>Credit</SelectItem>
                <SelectItem
               
                 value='loan'>Loan</SelectItem>
            </SelectContent>
          </Select>
           {errors.type && (
            <p className="text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

          {/* Amount and Account */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            className='mt-1'
            {...register("amount")}
          />
          {errors.amount && (
            <p className="text-sm text-red-500">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger className='mt-1'>
              <SelectValue  placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className='border-sidebar-border'>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.accountName} (${(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer >
                <Button
                  variant="default"
                  className="relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none 
                  hover:bg-[#fff] hover:text-primary text-[#fff] cursor-pointer shadow-lg"
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId && (
            <p className="text-sm text-red-500">{errors.accountId.message}</p>
          )}
        </div>
      </div>

       {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          value={watch('category')}

        >
          <SelectTrigger  className='mt-1 w-full'>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className='border-sidebar-border'>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

       {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium">OccurredAt</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !occurredAt && "text-muted-foreground"
              )}
            >
              {occurredAt ? format(occurredAt, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-sidebar-border" align="start">
            <Calendar
           
              mode="single"
              required
              selected={occurredAt}
              onSelect={(occurredAt: Date) => setValue("occurredAt", occurredAt)}
              disabled={(occurredAt: Date) =>
              occurredAt > new Date() || occurredAt < new Date("1900-01-01")
              }
              
            />
            </PopoverContent>
        </Popover>
        {errors.occurredAt && (
          <p className="text-sm text-red-500">{errors.occurredAt.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

       {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-[40%] text-xs text-center sm:text-sm"
          onClick={() => router.back()}
          disabled={transactionLoading!}
        >
          Cancel
        </Button>
        <Button type="submit" className="w-[45%] object-contain 
        text-xs text-center sm:text-sm" disabled={transactionLoading!}>
          {transactionLoading ? (
            <>
              <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </>
          ) : editMode ? (
            "Update Transaction"
          ) : (
            "Create Transaction"
          )}
        </Button>
      </div>
   

    </form>
  )
}

export default AddTransactionForm;