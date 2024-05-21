import { db } from '@/lib/firebase';
import { Store } from '@/types-db';
import { auth } from '@clerk/nextjs/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import React from 'react'
interface DashboardLayoutProps {
    children: React.ReactNode;
    params: { storeId: string }
}
const DashboardLayout = async ({ children, params }: DashboardLayoutProps) => {
    const { userId } = auth();

    if (!userId) {
        redirect('/sign-in')
    }

    const storeSnap = await getDocs(
        query(
            collection(db, 'stores'),
            where('userId', '==', userId),
            where('id', '==', params.storeId)
        )
    )

    let store = null as any

    storeSnap.forEach(doc => {
        store = doc.data() as Store
    })

    if (!store) {
        redirect('/')
    }

    return (
        <div>This is the Navbar {children}</div>
    )
}

export default DashboardLayout