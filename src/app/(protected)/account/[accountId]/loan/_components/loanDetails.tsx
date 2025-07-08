import { Button } from '@/components/ui/button';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LoanRecommendation } from '@/lib/schemas';
import React, { ReactNode } from 'react'
import { formatNumberWithCommas } from '../../page';
import { format } from 'date-fns';
import { SparkleIcon } from 'lucide-react';
import { Sheet, SheetTitle, SheetTrigger, SheetHeader, SheetContent } from '@/components/ui/sheet';

const LoanDetails  = ({children, loanApplication}:{children: ReactNode, loanApplication:LoanRecommendation}) => {
      const [open, setOpen] = React.useState(false);

  return (
    
    <Sheet open={open} onOpenChange={setOpen}>

        <SheetTrigger asChild>
            {children}
        </SheetTrigger>
        <SheetContent className='max-h-[100vh] overflow-y-scroll scrollbar-hide w-[100vw] md:max-w-[80vw] object-contain container'>
            <SheetHeader>
                <SheetTitle className='flex mb-4 text-lg md:text-3xl'>
                    Loan Recommendation Review
                </SheetTitle>
                
            </SheetHeader>
            <div className='w-full px-7'>

                <div className='flex justify-between gap-2 items-center font-bold border border-sidebar-border px-6 py-5 rounded-md shadow-lg
                mb-4'>
                            <Button variant='outline' size='sm' className='overflow-hidden'>
                                Net Income: <span className='font-bold'>{formatNumberWithCommas(loanApplication.netIncome)}</span> 
                            </Button>
                            <p className='font-bold text-xs'>
                                Credit score: <span className={`${loanApplication.creditScore <= 49 ? 'text-red-400' : 'text-green-600'}`}>{loanApplication.creditScore}%</span>
                            </p>
                </div>
                <div className='flex flex-col gap-4'>
                    <p className='font-bold border border-sidebar-border px-6 py-5 rounded-md shadow-lg'>
                        Repayment Plan: <span className='font-medium'>
                        {loanApplication.repaymentPlan}
                        </span>
                    </p>
                    <p className='font-bold border border-sidebar-border px-6 py-5 rounded-md shadow-lg'>
                        Decision Note: <span className='font-medium'>
                        {loanApplication.decisionNote}
                        </span >
                        <br />
                        <Button className='mt-2 text-left w-full overflow-hidden'>RLA:
                            <span className='font-bold text-xs'> {formatNumberWithCommas(loanApplication.recommendedLoanAmount)}</span>
                        </Button>
                        <Button variant='outline' className='mt-4 text-left flex w-full overflow-hidden'>Loan Tenure:
                            <span className='font-bold'> {loanApplication.loanTenure} {loanApplication.loanTenure > 1 ? 'Months' : 'Month'}</span>
                        </Button>
                    </p>

                </div>
                <div className='flex justify-between items-center mt-6 mb-6'>
                    <p className='text-left text-xs md:text-sm'>
                        EvaluatedAt: 

                        <span
                        className='font-bold'> {format(new Date (loanApplication.evaluatedAt), 'PP')}
                        </span> 
                    </p>
                    <Button variant='secondary' className='flex gap-2 font-semibold shadow-md cursor-pointer w-[40%]'>
                        <SparkleIcon className='animate-spin'/>
                        Analyze Risk
                    </Button>
                </div>
            </div>

        </SheetContent>
       
    </Sheet>
  )
}

export default LoanDetails;