'use client'

import { useState } from 'react'
import axios from 'axios'
import { Store } from '@prisma/client'
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
import { ApiAlert } from '@/components/ui/api-alert'
import { useOrigin } from '@/hooks/use-origin'

interface SettingsFormProps {
  initialData: Store
}

const formSchema = z.object({
  name: z.string().nonempty(),
})

type SettingsFormValues = z.infer<typeof formSchema>

export const SettingsForm = (props: SettingsFormProps) => {
  const { initialData } = props
  const params = useParams()
  const router = useRouter()
  const origin = useOrigin()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const onSubmitSettings = form.handleSubmit(async (data: SettingsFormValues) => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)

      router.refresh()
      toast.success('Settings updated')
    } catch (error) {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  })

  const onDeleteStore = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted')
    } catch (error) {
      toast.error('Make sure you have no products in your store')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        onConfirm={onDeleteStore}
        isLoading={isLoading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title="Settings"
          description="Manage your store's settings."
        />
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
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={onSubmitSettings}
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
                    <Input disabled={isLoading} placeholder="Store name" {...field} />
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
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}
