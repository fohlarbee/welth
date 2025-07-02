import React, { Suspense } from 'react'
import Dashboard from './page'
import { Loader2Icon } from 'lucide-react'

const DashboardLayout = () => {
  return (
    <div className='px-5'>
        <h1 className='
        text-5xl 
        bg-gradient-to-br from-blue-600 to-purple-600
        font-extrabold tracking-tighter pr-2  text-transparent bg-clip-text'>Dashboard</h1>

        <Suspense
        fallback={<Loader2Icon className='mt-4' width={"100%"} color='#9333ea'/>}>
            <Dashboard/>
        </Suspense>
    </div>
  )
}

export default DashboardLayout