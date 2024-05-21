import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { Loader } from 'lucide-react'
import React from 'react'
import MainNav from './main-nav'
import StoreSwitcher from './store-switcher'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Store } from '@/types-db'

const Navbar = async () => {

    const { userId } = auth()

    if (!userId) {
        redirect('/sign-in')
    }

    const storeSnap = await getDocs(
        query(collection(db, 'stores'), where('userId', '==', userId))
    )

    let stores = [] as Store[]

    storeSnap.forEach((doc) => {
        stores.push(doc.data() as Store)
    })

    return (
        <header className='border-b'>
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={stores} />

                {/* routes */}
                <MainNav />
                {/* UserProfile */}
                <div className="ml-auto">
                    <ClerkLoading>
                        <Loader className='h-5 w-5 text-muted-foreground animate-spin' />
                    </ClerkLoading>
                    <ClerkLoaded>
                        <UserButton afterSignOutUrl='/' />
                    </ClerkLoaded>
                </div>
            </div>
        </header>
    )
}

export default Navbar