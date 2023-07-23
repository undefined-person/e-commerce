'use client'

import { useState } from 'react'
import axios from 'axios'
import { Billboard } from '@prisma/client'
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
import { ImageUpload } from '@/components/ui/image-upload'

const formSchema = z.object({
  label: z.string().nonempty(),
  imageUrl: z.string().nonempty(),
})

type BillboardFormValues = z.infer<typeof formSchema>

interface BillboardFormProps {
  initialData: Billboard | null
}

export const BillboardForm = (props: BillboardFormProps) => {
  const { initialData } = props
  const params = useParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const title = initialData ? 'Edit billboard' : 'Add billboard'
  const description = initialData ? 'Edit your billboard' : 'Add a new billboard'
  const toastMessage = initialData ? 'Billboard updated' : 'Billboard added'
  const action = initialData ? 'Save changes' : 'Add billboard'

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      imageUrl: '',
      label: '',
    },
  })

  const onSubmitBillboard = form.handleSubmit(async (data: BillboardFormValues) => {
    try {
      setIsLoading(true)

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  })

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
      router.refresh()
      router.push(`/${params.storeId}/billboards`)
      toast.success('Billboard deleted.')
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.')
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
        onConfirm={onDelete}
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
          onSubmit={onSubmitBillboard}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} placeholder="Billboard label" {...field} />
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
