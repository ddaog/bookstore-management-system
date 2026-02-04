"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useStore } from "@/components/store-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FormSchema = z.object({
    itemId: z.string().min(1, {
        message: "상품을 선택해주세요.",
    }),
    quantity: z.coerce.number().min(1, "수량은 1개 이상이어야 합니다."),
})

export function SalesForm() {
    const { inventory, addSale } = useStore()
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema) as any,
        defaultValues: {
            quantity: 1
        }
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const item = inventory.find(i => i.id === data.itemId)
        if (!item) return

        const sale = {
            id: Math.random().toString(36).substr(2, 9),
            transactionId: Math.random().toString(36).substr(2, 9), // Single item transaction for now
            itemId: data.itemId,
            quantity: data.quantity,
            pricePerItem: item.price,
            totalPrice: item.price * data.quantity,
            date: new Date().toISOString()
        }

        addSale([sale])
        form.reset({
            itemId: "",
            quantity: 1
        })
        // toast({ title: "Sale Recorded", description: `${item.title} x${data.quantity}` })
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>판매 등록</CardTitle>
                <CardDescription>재고에서 상품을 선택하여 판매를 기록하세요.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="itemId"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>상품 선택</FormLabel>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? inventory.find(
                                                            (item) => item.id === field.value
                                                        )?.title
                                                        : "상품 선택..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[400px] p-0">
                                            <Command>
                                                <CommandInput placeholder="상품 검색..." />
                                                <CommandList>
                                                    <CommandEmpty>상품을 찾을 수 없습니다.</CommandEmpty>
                                                    <CommandGroup>
                                                        {inventory.map((item) => (
                                                            <CommandItem
                                                                value={item.id} // Ensure value matches search
                                                                key={item.id}
                                                                onSelect={() => {
                                                                    form.setValue("itemId", item.id)
                                                                    setOpen(false)
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        "mr-2 h-4 w-4",
                                                                        item.id === field.value
                                                                            ? "opacity-100"
                                                                            : "opacity-0"
                                                                    )}
                                                                />
                                                                {item.title} <span className="ml-2 text-xs text-muted-foreground">(재고: {item.stock})</span>
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>수량</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        판매된 수량을 입력하세요.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">판매 기록하기</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
