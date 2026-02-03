"use client"

import { useStore } from "@/components/store-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useParams } from "next/navigation"

export default function AuthorDashboardPage() {
    const params = useParams()
    const authorName = decodeURIComponent(params.id as string) // handle URL encoding

    const { inventory, sales } = useStore()

    // Filter data for this author
    const authorItems = inventory.filter(i => i.authorName === authorName)
    const itemIds = authorItems.map(i => i.id)
    const authorSales = sales.filter(s => itemIds.includes(s.itemId))

    const totalRevenue = authorSales.reduce((acc, curr) => acc + curr.totalPrice, 0)
    const totalSold = authorSales.reduce((acc, curr) => acc + curr.quantity, 0)

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{authorName} 작가님, 환영합니다!</h2>
                <p className="text-muted-foreground">판매 및 재고 대시보드입니다.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 판매량</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalSold} 권</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">총 매출 (세전)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(totalRevenue)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>현재 재고</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>책 제목</TableHead>
                                    <TableHead className="text-right">재고</TableHead>
                                    <TableHead className="text-right">가격</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {authorItems.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell className="text-right font-medium">{item.stock}</TableCell>
                                        <TableCell className="text-right">
                                            {new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(item.price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>최근 판매 내역</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>날짜</TableHead>
                                    <TableHead>상품명</TableHead>
                                    <TableHead className="text-right">수량</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {authorSales.length > 0 ? authorSales.map(sale => (
                                    <TableRow key={sale.id}>
                                        <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                                        <TableCell>{authorItems.find(i => i.id === sale.itemId)?.title}</TableCell>
                                        <TableCell className="text-right">{sale.quantity}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground p-4">판매 내역이 없습니다.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
