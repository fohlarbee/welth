import React from 'react'
import { getUserAccounts } from '../../../../../actions/dashboard';
import AddTransactionForm from '../_components/addTransactionForm';
import { defaultCategories } from '@/data/categories';

const AddTransaction = async() => {
    const accounts = await getUserAccounts();
  return (
    <div className='mx-auto max-w-3xl px-5'>
        <h2 className='
         md:text-5xl 
         text-2xl

        bg-gradient-to-br from-blue-600 to-purple-600
        font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text mb-3'>
            Add New Transaction</h2>

        <AddTransactionForm  accounts={accounts.data} categories={defaultCategories} editMode={false }/>
    </div>
  )
}

export default AddTransaction;