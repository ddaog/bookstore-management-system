"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
    name: z.string().min(1, { message: "이름을 입력해주세요." }),
    email: z.string().email({ message: "유효한 이메일 주소를 입력해주세요." }),
    phoneNumber: z.string().min(1, { message: "연락처를 입력해주세요." }),
    bankAccount: z.string().optional(),
    description: z.string().optional(),
})

export function AddAuthorDialog() {
    const [open, setOpen] = useState(false)
    const { addAuthor } = useStore()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            bankAccount: "",
            description: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const newAuthor = {
            id: Math.random().toString(36).substr(2, 9),
            ...values,
        }
        addAuthor(newAuthor)
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> 작가 등록
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>작가 등록</DialogTitle>
                    <DialogDescription>
                        새로운 작가 정보를 등록합니다. 연락처와 정산 계좌 정보를 입력해주세요.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>이름</FormLabel>
                                    <FormControl>
                                        <Input placeholder="작가명" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>이메일</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>연락처</FormLabel>
                                        <FormControl>
                                            <Input placeholder="010-0000-0000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="bankAccount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>정산 계좌 (선택)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="은행명 계좌번호" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>비고 / 설명 (선택)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="작가 소개 또는 메모" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">저장하기</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
