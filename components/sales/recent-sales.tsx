"use client"

import { useStore } from "@/components/store-provider"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentSales() {
    const { sales, inventory } = useStore()

    // Get item title helper
    const getItemTitle = (id: string) => inventory.find(i => i.id === id)?.title || "알 수 없는 상품"

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>최근 판매 내역</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>시간</TableHead>
                            <TableHead>상품명</TableHead>
                            <TableHead>수량</TableHead>
                            <TableHead className="text-right">금액</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sales.map((sale) => (
                            <TableRow key={sale.id}>
                                <TableCell>{new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                <TableCell>{getItemTitle(sale.itemId)}</TableCell>
                                <TableCell>{sale.quantity}</TableCell>
                                <TableCell className="text-right">
                                    {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(sale.totalPrice)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
