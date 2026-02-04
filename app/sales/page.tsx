"use client"

import { useState } from "react"
import { useStore } from "@/components/store-provider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, Minus, Trash2, CreditCard, History } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Item, Sale } from "@/lib/types"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface CartItem extends Item {
    quantity: number
}

export default function POSPage() {
    const { inventory, addSale } = useStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [cart, setCart] = useState<CartItem[]>([])
    const [date, setDate] = useState<Date | undefined>(new Date())

    const filteredItems = inventory.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.authorName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const addToCart = (item: Item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id)
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.id !== itemId))
    }

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(i => {
            if (i.id === itemId) {
                const newQty = Math.max(1, i.quantity + delta)
                return { ...i, quantity: newQty }
            }
            return i
        }))
    }

    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

    const handleCheckout = () => {
        if (cart.length === 0) return

        const transactionId = Math.random().toString(36).substr(2, 9)
        const newSales: Sale[] = cart.map(item => ({
            id: Math.random().toString(36).substr(2, 9),
            transactionId,
            itemId: item.id,
            quantity: item.quantity,
            pricePerItem: item.price,
            totalPrice: item.price * item.quantity,
            date: date ? date.toISOString() : new Date().toISOString()
        }))

        addSale(newSales)
        setCart([])
        // Optional: Show success toast or receipt dialog
    }

    return (
        <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-2rem)] gap-4">
            {/* Left: Product Catalog */}
            <div className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="상품명, 작가명 검색..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <ScrollArea className="h-[50vh] lg:h-auto lg:flex-1 rounded-md border p-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredItems.map(item => (
                            <Card
                                key={item.id}
                                className="cursor-pointer hover:bg-accent transition-colors"
                                onClick={() => addToCart(item)}
                            >
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base line-clamp-1">{item.title}</CardTitle>
                                    <div className="text-sm text-muted-foreground line-clamp-1">{item.authorName}</div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex justify-between items-center">
                                    <span className="font-bold">{item.price.toLocaleString()}원</span>
                                    <Badge variant={item.stock > 0 ? "outline" : "destructive"}>
                                        {item.stock > 0 ? `재고 ${item.stock}` : "품절"}
                                    </Badge>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Right: Cart */}
            <div className="w-full lg:w-[400px] flex flex-col gap-4">
                <Card className="flex-1 flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>장바구니 (Cart)</CardTitle>
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/sales/history">
                                <History className="h-4 w-4" />
                                <span className="sr-only">History</span>
                            </Link>
                        </Button>
                    </CardHeader>
                    <Separator />
                    <CardContent className="flex-1 p-0">
                        <ScrollArea className="h-[40vh] lg:h-[calc(100vh-14rem)] p-4">
                            <div className="flex flex-col gap-4">
                                {cart.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        상품을 선택해주세요.
                                    </div>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex justify-between items-center gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{item.title}</div>
                                                <div className="text-sm text-muted-foreground">{item.price.toLocaleString()}원</div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}>
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}>
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <Separator />
                    <div className="p-4 space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">판매 일자</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP", { locale: ko }) : <span>날짜 선택</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>총 결제금액</span>
                            <span>{totalAmount.toLocaleString()}원</span>
                        </div>
                        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={cart.length === 0}>
                            <CreditCard className="mr-2 h-4 w-4" /> 결제하기
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
