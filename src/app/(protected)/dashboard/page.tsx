import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { Card, CardContent } from '@/components/ui/card'
import { PlusIcon } from 'lucide-react'
import React from 'react'
import { getUserAccounts } from '../../../../actions/dashboard'
import { AccountCard } from './_components/accountCard'

const Dashboard = async () => {
  const result = await getUserAccounts();
  const accounts = result.success ? result.data : [];

  return (
    <div className='mt-10'>
        {/* Budget Progress */}
        
        {/* Overview */}    

        {/* Accounts Grid */}
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <CreateAccountDrawer>
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-sidebar-border">
            <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
              <PlusIcon className="h-10 w-10 mb-2" />
              <p className="text-sm font-medium">Add New Account</p>
            </CardContent>
          </Card>
        </CreateAccountDrawer>
        {accounts.length > 0 &&
          accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
      </div>


    </div>
  )
}

export default Dashboard