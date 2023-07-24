'use client'

import { ColumnDef } from '@tanstack/react-table'
import {
  Copy,
  Edit,
  MoreHorizontal,
  Trash,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import axios from 'axios'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { AlertModal } from '@/components/modals/alert-modal'

export type ProductColumn = {
  id: string
  name: string
  price: string
  size: string
  category: string
  color: {
    name: string
    value: string
  }
  isFeatured: boolean
  isArchived: boolean
  createdAt: string
}

interface CellActionProps {
  row: ProductColumn
}

const CellAction = (props: CellActionProps) => {
  const { row } = props
  const router = useRouter()
  const params = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('Copied to clipboard')
  }

  const onEdit = () => {
    router.push(`/${params.storeId}/products/${row.id}`)
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/products/${row.id}`)
      router.refresh()
      toast.success('Product deleted.')
    } catch (error: any) {
      toast.error('Something went wrong.')
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  const handleOpenModal = () => {
    setIsOpen(true)
  }

  return (
    <>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onDelete}
        isLoading={isLoading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Actions
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onCopy(row.id)}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenModal}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'color',
    header: 'Color',
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.color.name}
        <span
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Date',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction row={row.original} />,
  },
]
