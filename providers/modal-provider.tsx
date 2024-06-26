'use client'

import { StoreModal } from "@/components/modal/store-modal"
import { useState, useEffect } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <StoreModal />
        </>
    )

}