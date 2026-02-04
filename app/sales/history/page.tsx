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
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function SalesHistoryPage() {
    const { sales, inventory } = useStore()

    // Sort by date descending
    const sortedSales = [...sales].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Helper to get item details
    const getItem = (itemId: string) => inventory.find(i => i.id === itemId)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">판매 내역</h2>
                    <p className="text-muted-foreground">
                        전체 판매 기록을 확인합니다.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>판매 기록</CardTitle>
                    <CardDescription>총 {sales.length}건의 판매 기록이 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Total Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedSales.length > 0 ? (
                                sortedSales.map((sale) => {
                                    const item = getItem(sale.itemId)
                                    return (
                                        <TableRow key={sale.id}>
                                            <TableCell>
                                                {format(new Date(sale.date), "yyyy-MM-dd HH:mm")}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item?.title || "Unknown Item"}
                                            </TableCell>
                                            <TableCell>
                                                {item?.authorName || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {sale.quantity}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(sale.totalPrice)}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        기록이 없습니다.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
