'use client'
import React, { useState } from 'react'
import { Billboards, Category } from '@/types-db'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


interface CategoryFormProps {
  initialData: Category,
  billboards: Billboards[]
}

const formSchema = z.object({
  name: z.string().min(1),
  billboardId: z.string().min(1)
})

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const params = useParams();
  const router = useRouter()

  const title = initialData ? 'Edit Category' : "Create Category"
  const description = initialData ? 'Edit a Category' : 'Add a New Category'
  const toastMessage = initialData ? 'Category Updated' : 'Category Created'
  const action = initialData ? 'Save Changes' : 'Create Category'

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("🚀 ~ onSubmit ~ data:", data)
    try {
      setIsLoading(true)

      const { billboardId: formBillId } = form.getValues()

      const matchingBillboard = billboards.find((item) => item.id === formBillId)

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, { ...data, billboardLabel: matchingBillboard?.label })
      } else {
        await axios.post(`/api/${params.storeId}/categories`, { ...data, billboardLabel: matchingBillboard?.label })
      }
      toast.success(toastMessage)
      router.push(`/${params.storeId}/categories`)
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
      await axios.delete(`/api/${params.storeId}/billboards/${params.categoryId}`)
      toast.success('Category Removed')
      router.refresh();
      router.push(`/${params.storeId}/categories`)
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
                  <Input disabled={isLoading} placeholder="Your category name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
            />
            <FormField control={form.control} name="billboardId" render={({ field }) => (
              <FormItem>
                <FormLabel>Billboard</FormLabel>
                <FormControl>
                  <Select disabled={isLoading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder='Select a billboard' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>{billboard.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

export default CategoryForm