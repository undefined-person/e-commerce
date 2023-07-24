'use client'

import { useState } from 'react'
import axios from 'axios'
import { Size } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { Trash } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-hot-toast'
import { z } from 'zod'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AlertModal } from '@/components/modals/alert-modal'

const formSchema = z.object({
  name: z.string().nonempty(),
  value: z.string().nonempty(),
})

type SizeFormValues = z.infer<typeof formSchema>

interface SizeFormProps {
  initialData: Size | null
}

export const SizeForm = (props: SizeFormProps) => {
  const { initialData } = props
  const params = useParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const title = initialData ? 'Edit size' : 'Add size'
  const description = initialData ? 'Edit your size' : 'Add a new size'
  const toastMessage = initialData ? 'Size updated' : 'Size added'
  const action = initialData ? 'Save changes' : 'Add size'

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  const onSubmitSize = form.handleSubmit(async (data: SizeFormValues) => {
    try {
      setIsLoading(true)

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  })

  const onDeleteSize = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
      router.refresh()
      router.push(`/${params.storeId}/sizes`)
      toast.success('Size deleted')
    } catch (error: any) {
      toast.error('Make sure you removed all products using this size first.')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDeleteSize}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          description={description}
        />
        {
          initialData ? (
            <Button
              disabled={isLoading}
              variant="destructive"
              size="sm"
              onClick={() => {
                setIsOpen(true)
              }}
              aria-label="Delete store"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )
            : null
        }
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={onSubmitSize}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Size name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Size value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isLoading}
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  )
}
