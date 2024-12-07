"use client"

import { useState } from "react"
import { nanoid } from "nanoid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { type Todo } from "@/lib/types"

interface AddTodoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (todo: Todo) => void
}

export function AddTodoDialog({
  open,
  onOpenChange,
  onAdd,
}: AddTodoDialogProps) {
  const [title, setTitle] = useState("Imagine(d) what you can achieve today.")
  const [description, setDescription] = useState("This text is added so you don't have to type anything in, but feel free to edit!")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    onAdd({
      id: nanoid(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
      date: new Date(),
    })

    setTitle("")
    setDescription("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit">Add Todo</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

