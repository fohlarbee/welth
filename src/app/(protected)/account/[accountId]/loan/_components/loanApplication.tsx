"use client";
import React from 'react'
import type { LoanApplication } from "@/generated/prisma";
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteOrUpdateLoanApplication } from '../../../../../../../actions/loan';
import useFetch from '@/hooks/useFetch';
import { Clock12Icon } from 'lucide-react';
import LoanDetails from './loanDetails';


const LoanApplication = ({loanApplications}: {loanApplications: LoanApplication[],  }) => {
    // eslint-disable-next-line
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const {
    loading: loanApplicationLoading,
    fn: updateLoanApplicationFn,
    // error,
  } = useFetch(deleteOrUpdateLoanApplication);
  return (
    <>
            <h1 className='text-xl font-semibold mb-4'>Loan Applications</h1>
            {loanApplications && loanApplications.length === 0 && <div>No loan Application yet</div>}
            {isLoading && <div>Loading...</div>}
            <ul className='divide-y divide-gray-200'>
                {loanApplications && loanApplications?.map((l, i) => {
                    return (
                    <li key={i} className='flex flex-col items-center justify-between py-5 px-4 gap-x-6 shadow-md border border-sidebar-border border-opacity-5 rounded-md 
                    mb-4 mx-auto max-w-3xl'>
                        <div className=' w-[100%] flex gap-4 items-center'>
                                <p className='whitespace-nowrap truncate text-ellipsis overflow-hidden
                                text-sm font-semibold'>
                                        {l.decisionNote}
                                </p>
                                <div>
                                    {l.status == 'pending' && (
                                            <Badge className='bg-yellow-500 text-[#fff] ml-3 justify-start'>
                                                Processing...  
                                            </Badge>
                                     )}
                                    {l.status == 'Ready' && (
                                        <Badge className='bg-green-500 text-[#fff] ml-3 justify-start text-left '>
                                            Ready  
                                        </Badge>
                                    )}
                                </div>
                        </div>
                        <div className='flex gap-4 w-[100%] items-center mt-2 mb-2'>
                            <p className='text-sm'>
                                {l.evaluatedAt.toLocaleDateString()}
                            </p>
                            <p className='text-sm font-semibold 
                            whitespace-nowrap truncate text-ellipsis flex gap-2 items-center'>
                                <Clock12Icon size={20} className='text-primary'/>
                                {l.loanTenure} {l.loanTenure && l.loanTenure > 1 ? 'Months' : 'Month'}</p>
                        </div>
                        <div className='w-[100%] items-center flex justify-between'>
                            <p className='font-semibold text-sm md:text-sm'>Credit score: {l.creditScore}%</p>
                            <LoanDetails loanApplication={{ ...l, loanTenure: l.loanTenure ?? 0, repaymentPlan: String(l.repaymentPlan ?? ""),
                                                            decisionNote: l.decisionNote ?? '',
                                                            netIncome: typeof l.netIncome === 'number' ? l.netIncome : Number(l.netIncome) ?? 0,
                                                            recommendedLoanAmount: l.recommendedLoanAmount ?? 0,
                                                            creditScore: l.creditScore ?? 0,
                                                            evaluatedAt: typeof l.evaluatedAt === 'string' ? l.evaluatedAt : (l.evaluatedAt instanceof Date ? 
                                                                l.evaluatedAt.toISOString() : new Date().toISOString())
                                                         }}>

                                <Button size='sm' variant='outline'
                                
                                 className=' relative cursor-pointer justify-end text-end '>
                                View Application    
                                </Button>
                            </LoanDetails>              
                        </div>
                       
                       
                        
                    </li>
               )})}

            </ul>
    </>
  )
}

export default LoanApplication