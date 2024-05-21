'use client'
import React, { useState } from 'react'
import { Store } from '@/types-db'
import Heading from '@/components/heading'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import axios from 'axios'
import { AlertModal } from '@/components/modal/alert-modal'

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Store name should be minium 3 characters' })
})

const SettingsForm = ({ initialData }: SettingsFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name
    }
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const params = useParams();
  const router = useRouter()

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const response = await axios.patch(`/api/stores/${params.storeId}`, data)
      toast.success('Store Updated')
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      const response = await axios.delete(`/api/stores/${params.storeId}`)
      toast.success('Store Removed')
      router.refresh();
      router.push('/')
    } catch (error) {
      toast.error("Something went Wrong")
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isLoading} />
      <div className="flex items-center justify-center">
        <Heading title='Settings' description='Manage Store Preferences' />
        <Button variant={'destructive'} size={'icon'} onClick={() => setOpen(true)}>
          <Trash className='h-4 w-4' />
        </Button>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
          <div className="grid grid-cols-3 gap-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Your store name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          </div>
          <Button disabled={isLoading} type="submit" size='sm'>Save Changes</Button>
        </form>
      </Form>
      <Separator />

    </>
  )
}

export default SettingsForm