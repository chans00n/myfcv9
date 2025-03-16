"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { UploadCloud } from "lucide-react"

export interface FileInputProps {
  onChange?: (files: File[]) => void
  onError?: (error: string) => void
  value?: File[]
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  disabled?: boolean
  className?: string
  dropzoneClassName?: string
  preview?: boolean
}

const FileInput = React.forwardRef<HTMLDivElement, FileInputProps>(
  ({ 
    className, 
    onChange, 
    onError, 
    value = [], 
    maxFiles = 1, 
    maxSize = 5 * 1024 * 1024, // 5MB
    accept = { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    disabled = false,
    dropzoneClassName,
    preview = true,
    ...props 
  }, ref) => {
    const [files, setFiles] = React.useState<File[]>(value)
    const initializedRef = React.useRef(false)

    const onDrop = React.useCallback(
      (acceptedFiles: File[], rejectedFiles: any[]) => {
        if (rejectedFiles.length > 0) {
          const errors = rejectedFiles[0].errors.map((error: any) => error.message).join(", ")
          onError?.(errors)
          return
        }

        const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles)
        setFiles(newFiles)
        onChange?.(newFiles)
      },
      [files, maxFiles, onChange, onError]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      maxFiles,
      maxSize,
      accept,
      disabled,
    })

    const removeFile = (index: number) => {
      const newFiles = [...files]
      newFiles.splice(index, 1)
      setFiles(newFiles)
      onChange?.(newFiles)
    }

    // Only update files from value prop on initial render
    React.useEffect(() => {
      if (!initializedRef.current) {
        setFiles(value)
        initializedRef.current = true
      }
    }, [value])

    return (
      <div ref={ref} className={cn("space-y-4", className)}>
        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center rounded-md border border-dashed p-6 text-center",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            disabled && "cursor-not-allowed opacity-60",
            dropzoneClassName
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive ? "Drop the files here" : "Drag & drop files here, or click to select"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {maxFiles > 1 ? `Up to ${maxFiles} files` : "Only 1 file"} (max {Math.round(maxSize / 1024 / 1024)}MB each)
          </p>
        </div>

        {preview && files.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {files.map((file, index) => (
              <div key={index} className="relative rounded-md border bg-background p-2">
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-32 w-full rounded-md object-cover"
                  />
                )}
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground truncate max-w-[80%]">
                    {file.name}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
)

FileInput.displayName = "FileInput"

export { FileInput } 