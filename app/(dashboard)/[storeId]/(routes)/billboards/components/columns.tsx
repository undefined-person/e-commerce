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

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}

interface CellActionProps {
  row: BillboardColumn
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
    router.push(`/${params.storeId}/billboards/${row.id}`)
  }

  const onDelete = async () => {
    try {
      setIsLoading(true)
      await axios.delete(`/api/${params.storeId}/billboards/${row.id}`)
      router.refresh()
      toast.success('Billboard deleted.')
    } catch (error: any) {
      toast.error('Make sure you removed all categories using this billboard first.')
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

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
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
