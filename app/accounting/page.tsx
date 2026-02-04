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
import { Badge } from "@/components/ui/badge"

export default function AccountingPage() {
    const { inventory, sales } = useStore()

    // Calculate metrics for each item
    const accountingData = inventory.map(item => {
        const itemSales = sales.filter(s => s.itemId === item.id)
        const totalSold = itemSales.reduce((acc, s) => acc + s.quantity, 0)

        // Mock settled count for now (assuming 0 for simplicity, or we could link to actual settlements later)
        const settledCount = 0
        const pendingCount = totalSold - settledCount

        const supplyRate = item.supplyRate || 70 // Default to 70% if missing
        // Pending Amount = Price * Pending Count * (Supply Rate / 100)
        // This is the amount we need to pay to the author
        const pendingAmount = item.price * pendingCount * (supplyRate / 100)

        return {
            ...item,
            totalSold,
            settledCount,
            pendingCount,
            supplyRate,
            pendingAmount
        }
    }).filter(data => data.totalSold > 0) // Only show items with sales activity

    // Calculate totals
    const totalPendingAmount = accountingData.reduce((acc, item) => acc + item.pendingAmount, 0)

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">회계 / 정산 현황</h2>
                    <p className="text-muted-foreground">
                        품목별 판매 및 정산 예정 내역을 확인합니다.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            총 정산 예정 금액
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(totalPendingAmount)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            전체 품목의 미정산 잔액 합계
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>품목별 현황</CardTitle>
                    <CardDescription>
                        판매가 발생한 품목의 상세 정산 데이터입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>도서명</TableHead>
                                <TableHead>작가</TableHead>
                                <TableHead className="text-center">공급률</TableHead>
                                <TableHead className="text-right">총 판매</TableHead>
                                <TableHead className="text-right">기정산</TableHead>
                                <TableHead className="text-right">정산 대기</TableHead>
                                <TableHead className="text-right">정산 예정액</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accountingData.length > 0 ? (
                                accountingData.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.title}</TableCell>
                                        <TableCell>{item.authorName}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline">{item.supplyRate}%</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{item.totalSold}권</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{item.settledCount}권</TableCell>
                                        <TableCell className="text-right font-bold text-orange-600">{item.pendingCount}권</TableCell>
                                        <TableCell className="text-right font-bold">
                                            {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(item.pendingAmount)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        판매 데이터가 없습니다.
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
