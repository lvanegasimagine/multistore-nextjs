import { db } from "@/lib/firebase"
import { Cuisine } from "@/types-db"
import { auth } from "@clerk/nextjs/server"
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request, { params }: { params: { storeId: string, cuisineId: string } }) => {
    try {
        const { userId } = auth()
        const body = await req.json()

        if (!userId) {
            return new NextResponse('Un-Authorized', { status: 400 })
        }

        const { name, value } = body

        if (!name) {
            return new NextResponse('Cuisine Name is missing', { status: 400 })
        }

        if (!value) {
            return new NextResponse('Cuisine value is missing', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is missing', { status: 400 })
        }

        const store = await getDoc(doc(db, 'stores', params.storeId))

        if (store.exists()) {
            let storeData = store.data()

            if (storeData?.userId !== userId) {
                return new NextResponse('Un-Authorized Access', { status: 400 })
            }
        }

        const cuisineRef = await getDoc(
            doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId)
        )

        if (cuisineRef.exists()) {
            await updateDoc(
                doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId), {
                ...cuisineRef.data(),
                name,
                value,
                updatedAt: serverTimestamp()
            })
        } else {
            return new NextResponse('Cuisine not found', { status: 400 })
        }

        const cuisine = (
            await getDoc(
                doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId)
            )
        ).data() as Cuisine

        return NextResponse.json(cuisine)

    } catch (error) {
        console.log(`KITCHENS_PATCH:${error}`)
        return new NextResponse('Internal Server error', { status: 500 })
    }
}

export const DELETE = async (req: Request, { params }: { params: { storeId: string, cuisineId: string } }) => {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Un-Authorized', { status: 400 })
        }

        if (!params.storeId) {
            return new NextResponse('Store Id is missing', { status: 400 })
        }

        if (!params.cuisineId) {
            return new NextResponse('Cuisine Id is missing', { status: 400 })
        }

        const store = await getDoc(doc(db, 'stores', params.storeId))

        if (store.exists()) {
            let storeData = store.data()

            if (storeData?.userId !== userId) {
                return new NextResponse('Un-Authorized Access', { status: 500 })
            }
        }

        const cuisineRef = await doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId)

        await deleteDoc(cuisineRef)

        return NextResponse.json({ msg: 'Cuisine deleted successfully' })

    } catch (error) {
        console.log(`CUISINES_DELETE:${error}`)
        return new NextResponse('Internal Server error', { status: 500 })
    }
}