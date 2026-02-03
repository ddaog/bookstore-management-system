"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useStore } from "@/components/store-provider"
import { Item } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    quantity: z.coerce.number().min(1, { message: "1개 이상 입력해주세요." }),
})

interface RestockDialogProps {
    item: Item
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function RestockDialog({ item, open, onOpenChange }: RestockDialogProps) {
    const { addRestock } = useStore()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            quantity: 1,
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const record = {
            id: Math.random().toString(36).substr(2, 9),
            itemId: item.id,
            quantity: values.quantity,
            date: new Date().toISOString(),
        }
        addRestock(record)
        onOpenChange(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>재입고 기록</DialogTitle>
                    <DialogDescription>
                        Title: {item.title} <br />
                        현재 재고: {item.stock}권 &rarr; 예상 재고: {item.stock + (Number(form.watch("quantity")) || 0)}권
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>입고 수량</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">확인</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
