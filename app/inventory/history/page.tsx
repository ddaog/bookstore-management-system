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

export default function RestockHistoryPage() {
    const { restocks, inventory } = useStore()

    // Sort by date descending
    const sortedRestocks = [...restocks].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">재입고 내역</h2>
                    <p className="text-muted-foreground">
                        전체 재입고 이력을 확인합니다.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>재입고 기록</CardTitle>
                    <CardDescription>총 {restocks.length}건의 재입고 기록이 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Item Name</TableHead>
                                <TableHead>Author</TableHead>
                                <TableHead>Quantity</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedRestocks.length > 0 ? (
                                sortedRestocks.map((record) => {
                                    const item = inventory.find(i => i.id === record.itemId)
                                    return (
                                        <TableRow key={record.id}>
                                            <TableCell>
                                                {format(new Date(record.date), "yyyy-MM-dd HH:mm")}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {item?.title || "Unknown Item (Deleted)"}
                                            </TableCell>
                                            <TableCell>
                                                {item?.authorName || "-"}
                                            </TableCell>
                                            <TableCell>
                                                +{record.quantity}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
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
