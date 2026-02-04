"use client"

import { useStore } from "@/components/store-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Sale } from "@/lib/types"

interface Transaction {
    transactionId: string
    date: string
    items: Sale[]
    totalAmount: number
    itemCount: number
    summaryTitle: string
}

export default function SalesHistoryPage() {
    const { sales, inventory } = useStore()

    // Group sales by transactionId
    const groupedSales = sales.reduce((acc, sale) => {
        if (!acc[sale.transactionId]) {
            acc[sale.transactionId] = {
                transactionId: sale.transactionId,
                date: sale.date,
                items: [],
                totalAmount: 0,
                itemCount: 0,
                summaryTitle: ""
            }
        }
        acc[sale.transactionId].items.push(sale)
        acc[sale.transactionId].totalAmount += sale.totalPrice
        acc[sale.transactionId].itemCount += sale.quantity
        return acc
    }, {} as Record<string, Transaction>)

    const sortedTransactions = Object.values(groupedSales).sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    ).map(transaction => {
        const firstItemName = inventory.find(i => i.id === transaction.items[0].itemId)?.title || "Unknown Item"
        const otherCount = transaction.items.length - 1
        return {
            ...transaction,
            summaryTitle: otherCount > 0 ? `${firstItemName} 외 ${otherCount}건` : firstItemName
        }
    })

    // Helper to get item details
    const getItem = (itemId: string) => inventory.find(i => i.id === itemId)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">판매 내역 (Sales History)</h2>
                    <p className="text-muted-foreground">
                        결제 단위별 판매 기록을 확인합니다.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>최근 결제 목록</CardTitle>
                    <CardDescription>총 {sortedTransactions.length}건의 결제 기록이 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    {sortedTransactions.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                            {sortedTransactions.map((transaction) => (
                                <AccordionItem key={transaction.transactionId} value={transaction.transactionId}>
                                    <AccordionTrigger className="hover:no-underline">
                                        <div className="flex flex-1 items-center justify-between pr-4 font-normal">
                                            <div className="flex gap-4 items-center">
                                                <span className="text-muted-foreground w-32 text-left">
                                                    {format(new Date(transaction.date), "yyyy-MM-dd HH:mm")}
                                                </span>
                                                <span className="font-medium text-left">
                                                    {transaction.summaryTitle}
                                                </span>
                                                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-secondary-foreground">
                                                    총 {transaction.itemCount}권
                                                </span>
                                            </div>
                                            <div className="font-bold">
                                                {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(transaction.totalAmount)}
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <div className="px-4 py-2 bg-muted/20 rounded-md">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>도서명</TableHead>
                                                        <TableHead>작가</TableHead>
                                                        <TableHead className="text-right">수량</TableHead>
                                                        <TableHead className="text-right">가격</TableHead>
                                                        <TableHead className="text-right">합계</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {transaction.items.map((sale) => {
                                                        const item = getItem(sale.itemId)
                                                        return (
                                                            <TableRow key={sale.id}>
                                                                <TableCell className="font-medium">
                                                                    {item?.title || "Unknown Item"}
                                                                </TableCell>
                                                                <TableCell>{item?.authorName || "-"}</TableCell>
                                                                <TableCell className="text-right">{sale.quantity}</TableCell>
                                                                <TableCell className="text-right">
                                                                    {item?.price.toLocaleString()}원
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {sale.totalPrice.toLocaleString()}원
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            판매 기록이 없습니다.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
