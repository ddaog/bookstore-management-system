"use client"

import { useStore } from "@/components/store-provider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CircleDollarSign, Package, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function DashboardPage() {
    const { inventory, sales, settlements } = useStore()

    // 1. Today's Sales
    const today = new Date().toISOString().split('T')[0]
    const todaySales = sales.filter(s => s.date.startsWith(today))
    const todayRevenue = todaySales.reduce((sum, s) => sum + s.totalPrice, 0)
    const todayCount = todaySales.reduce((sum, s) => sum + s.quantity, 0)

    // 2. Low Stock Items (Top 5)
    const lowStockItems = inventory.filter(i => i.stock < 3).slice(0, 5)

    // 3. Pending Settlements
    const pendingSettlements = settlements.filter(s => s.status === 'Pending')
    const pendingSettlementAmount = pendingSettlements.reduce((sum, s) => sum + s.payoutAmount, 0)

    // 4. Best Sellers (Simple logic: by quantity sold in all time)
    // Assuming sales list could be long, we might need optimization later, but fine for prototype.
    const itemSalesCount: Record<string, number> = {}
    sales.forEach(s => {
        itemSalesCount[s.itemId] = (itemSalesCount[s.itemId] || 0) + s.quantity
    })
    const bestSellers = Object.entries(itemSalesCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([itemId, count]) => {
            const item = inventory.find(i => i.id === itemId)
            return {
                title: item?.title || "Unknown",
                author: item?.authorName || "Unknown",
                count
            }
        })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">대시보드</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            오늘 매출
                        </CardTitle>
                        <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayRevenue.toLocaleString()}원</div>
                        <p className="text-xs text-muted-foreground">
                            판매 {todayCount}건
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            총 상품 수
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inventory.length}종</div>
                        <p className="text-xs text-muted-foreground">
                            재고 {inventory.reduce((acc, cur) => acc + cur.stock, 0)}권
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            미정산 금액
                        </CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingSettlementAmount.toLocaleString()}원</div>
                        <p className="text-xs text-muted-foreground">
                            {pendingSettlements.length}건 대기 중
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            총 판매 누적
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{sales.reduce((acc, cur) => acc + cur.totalPrice, 0).toLocaleString()}원</div>
                        <p className="text-xs text-muted-foreground">
                            총 {sales.length}건의 거래
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>인기 판매 도서 (Top 5)</CardTitle>
                        <CardDescription>
                            가장 많이 판매된 도서 목록입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {bestSellers.map((item, index) => (
                                <div className="flex items-center" key={index}>
                                    <div className="flex items-center justify-center w-9 h-9 border rounded-full mr-4 text-sm font-bold bg-muted">
                                        {index + 1}
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{item.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.author}
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">{item.count}권 판매</div>
                                </div>
                            ))}
                            {bestSellers.length === 0 && (
                                <div className="text-center text-muted-foreground py-4">아직 판매 데이터가 없습니다.</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>재고 부족 알림</CardTitle>
                        <CardDescription>
                            재고가 3권 미만인 상품입니다.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-4">
                                {lowStockItems.map(item => (
                                    <div className="flex items-center justify-between" key={item.id}>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{item.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.authorName}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-bold ${item.stock === 0 ? "text-destructive" : "text-orange-500"}`}>
                                                {item.stock}권
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {lowStockItems.length === 0 && (
                                    <div className="text-center text-muted-foreground py-4">재고가 부족한 상품이 없습니다.</div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
