import { db } from '@/lib/firebase'
import { Cuisine } from '@/types-db'
import { doc, getDoc } from 'firebase/firestore'
import React from 'react'
import CuisineForm from './_components/cuisine-form'

const CuisinePage = async ({ params }: { params: { cuisineId: string, storeId: string } }) => {

    const kitchen = (await getDoc(doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId))).data() as Cuisine

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CuisineForm initialData={kitchen} />
            </div>
        </div>
    )
}

export default CuisinePage