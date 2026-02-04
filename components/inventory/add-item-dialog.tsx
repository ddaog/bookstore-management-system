"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus } from "lucide-react"
import { useStore } from "@/components/store-provider"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { BookType, AcqMethod } from "@/lib/types"

const formSchema = z.object({
    title: z.string().min(1, { message: "상품명을 입력해주세요." }),
    authorId: z.string().min(1, { message: "작가를 선택해주세요." }),
    price: z.coerce.number().min(0, { message: "가격은 0원 이상이어야 합니다." }),
    stock: z.coerce.number().min(0, { message: "재고는 0개 이상이어야 합니다." }),
    supplyRate: z.coerce.number().min(0).max(100, { message: "0~100 사이 값이어야 합니다." }),
    type: z.enum(["Independent", "General", "Goods"] as const),
    method: z.enum(["Purchase", "Consignment"] as const),
})

export function AddItemDialog() {
    const [open, setOpen] = useState(false)
    const { addItem, authors } = useStore() // Use the store

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            title: "",
            authorId: "",
            price: 0,
            stock: 0,
            supplyRate: 70,
            type: "Independent",
            method: "Consignment",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            ...values,
            authorName: authors.find(a => a.id === values.authorId)?.name || 'Unknown',
            entryDate: new Date().toISOString().split('T')[0]
        }
        addItem(newItem)
        // alert(`Added: ${values.title}`) 
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> 상품 등록
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>새 상품 등록</DialogTitle>
                    <DialogDescription>
                        새로운 독립서적, 일반서적, 또는 소품을 재고에 추가합니다.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>상품명 (책 제목)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="상품명을 입력하세요" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="authorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>작가 / 브랜드</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="작가 선택" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {authors.map((author) => (
                                                <SelectItem key={author.id} value={author.id}>
                                                    {author.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>가격 (KRW)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="15000"
                                                {...field}
                                                onChange={(e) => field.onChange(+e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>초기 입고 수량</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="10"
                                                {...field}
                                                onChange={(e) => field.onChange(+e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="supplyRate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>공급률 (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="70"
                                            {...field}
                                            onChange={(e) => field.onChange(+e.target.value)}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>구분</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="구분 선택" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Independent">독립서적</SelectItem>
                                                <SelectItem value="General">일반서적</SelectItem>
                                                <SelectItem value="Goods">소품 (Goods)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>입고 방식</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="방식 선택" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Purchase">매입</SelectItem>
                                                <SelectItem value="Consignment">위탁</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit">저장하기</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
