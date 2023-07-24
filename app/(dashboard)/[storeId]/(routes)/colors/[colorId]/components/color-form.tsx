'use client'

import { useState } from 'react'
import axios from 'axios'
import { Color } from '@prisma/client'
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
  value: z.string().min(4).regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'Invalid color value',
  }),
})

type ColorFormValues = z.infer<typeof formSchema>

interface ColorFormProps {
  initialData: Color | null
}

export const ColorForm = (props: ColorFormProps) => {
  const { initialData } = props
  const params = useParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const title = initialData ? 'Edit color' : 'Add color'
  const description = initialData ? 'Edit your color' : 'Add a new color'
  const toastMessage = initialData ? 'Color updated' : 'Color added'
  const action = initialData ? 'Save changes' : 'Add color'

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      value: '',
    },
  })

  const onSubmitColor = form.handleSubmit(async (data: ColorFormValues) => {
    try {
      setIsLoading(true)

      if (initialData) {
        await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
      } else {
        await axios.post(`/api/${params.storeId}/colors`, data)
      }

      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success(toastMessage)
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  })

  const onDeleteColor = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`)
      router.refresh()
      router.push(`/${params.storeId}/colors`)
      toast.success('Color deleted')
    } catch (error: any) {
      toast.error('Make sure you removed all products using this color first.')
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
        onConfirm={onDeleteColor}
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
          onSubmit={onSubmitColor}
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
                    <Input disabled={isLoading} placeholder="Color name" {...field} />
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
                    <div className="flex items-center gap-x-4">
                      <Input disabled={isLoading} placeholder="Color value" {...field} />
                      <span
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
