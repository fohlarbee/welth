import React, { Suspense } from 'react'
import LoanCard from './_components/loan-card'
import { getAccountAndLoanApplications } from '../../../../../../actions/loan';
import { BarLoader } from 'react-spinners';
import LoanApplication from './_components/loanApplication';



type Props = {
    params:Promise<{accountId:string}>}

const Loan = async({params}: Props) => {
  const { accountId } = await params;
 

 
    const loanData = await getAccountAndLoanApplications(accountId);
    
  

  return (
    <div className='mx-auto max-w-3xl px-5'>
         <h2 className='
         md:text-5xl 
         text-2xl

        bg-gradient-to-br from-blue-600 to-purple-600
        font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text mb-3'>
            AI Loan Recommendation</h2>
        <LoanCard accountId={accountId}  />
        <div className="h-6"></div>

        {/* Transactions Table */}
        <Suspense
          fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}
        >
          <LoanApplication loanApplications={loanData ?? []} />
        </Suspense>

        
    </div>
  )
}

export default Loan