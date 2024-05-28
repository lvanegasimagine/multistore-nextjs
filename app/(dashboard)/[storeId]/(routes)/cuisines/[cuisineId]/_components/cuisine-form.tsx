'use client'
import React, { useState } from 'react'
import { Kitchen, Size } from '@/types-db'
import { AlertModal } from '@/components/modal/alert-modal'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Heading from '@/components/heading'
import toast from 'react-hot-toast'
import axios from 'axios'


interface CuisineFormProps {
  initialData: Kitchen,
}

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1)
})

const CuisineForm = ({ initialData }: CuisineFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const params = useParams();
  const router = useRouter()

  const title = initialData ? 'Edit Cuisine' : "Create Cuisine"
  const description = initialData ? 'Edit a Cuisine' : 'Add a New Cuisine'
  const toastMessage = initialData ? 'Cuisine Updated' : 'Cuisine Created'
  const action = initialData ? 'Save Changes' : 'Create Cuisine'

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    try {
      setIsLoading(true)
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/cuisines/${params.kitchenId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/cuisines`, data)
      }
      toast.success(toastMessage)
      router.push(`/${params.storeId}/cuisines`)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      router.refresh()
      setIsLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/cuisines/${initialData.id}`)
      toast.success('Size Removed')
      router.push(`/${params.storeId}/cuisines`)
    } catch (error) {
      toast.error("Something went Wrong")
    } finally {
      router.refresh();
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={isLoading} />
      <div className="flex items-center justify-center">
        <Heading title={title} description={description} />
        {initialData && (
          <Button disabled={isLoading} variant={'destructive'} size={'icon'} onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4' />
          </Button>
        )}
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-8'>
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Your cuisine name..." {...field} autoFocus />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField control={form.control} name="value" render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input disabled={isLoading} placeholder="Your cuisine value..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
          </div>
          <Button disabled={isLoading} type="submit" size='sm'>{action}</Button>
        </form>
      </Form>
    </>
  )
}

export default CuisineForm