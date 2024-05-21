import { PlusCircle } from 'lucide-react'
import React from 'react'

interface CreateNewStoreItemProps {
    onClick: () => void
}
const CreateNewStoreItem = ({ onClick }: CreateNewStoreItemProps) => {
    return (
        <div className='flex items-center bg-gray-50 px-2 py-1 cursor-pointer text-muted-foreground hover:text-primary text-pretty' onClick={onClick}>
            <PlusCircle className='mr-2 h-5 w-5'/>
            Create Store
        </div>
    )
}

export default CreateNewStoreItem