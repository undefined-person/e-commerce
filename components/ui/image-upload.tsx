'use client'

import { ImagePlus, Plus, Trash } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'

import { useIsMounted } from '@/hooks/use-mounted'
import { Button } from '@/components/ui/button'

interface ImageUploadProps {
  disabled?: boolean
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: Array<string>
}

export const ImageUpload = (props: ImageUploadProps) => {
  const {
    disabled,
    onChange,
    onRemove,
    value,
  } = props
  const isMounted = useIsMounted()

  const onUploadImage = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) {
    return null
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {
          value.map((url) => (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
              <div className="z-10 absolute top-2 right-2">
                <Button
                  type="button"
                  onClick={() => onRemove(url)}
                  variant="destructive"
                  size="icon"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
              <Image
                src={url}
                layout="fill"
                objectFit="cover"
                alt="Billboard image"
              />
            </div>
          ))
        }
      </div>
      <CldUploadWidget
        onUpload={onUploadImage}
        uploadPreset="pvwqzhzb"
      >
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button
              type="button"
              disabled={disabled}
              onClick={onClick}
              variant="secondary"
              size="sm"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an Image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
