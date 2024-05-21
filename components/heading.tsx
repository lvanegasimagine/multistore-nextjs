import React from 'react'

interface HeadingProps {
    title: string,
    description: string
}
const Heading = ({ title, description }: HeadingProps) => {

    return (
        <div className='w-full'>
            <div className="text-3xl font-bold tracking-tight">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
        </div>
    )
}

export default Heading