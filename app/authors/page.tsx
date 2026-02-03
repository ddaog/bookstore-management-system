"use client"

import { useStore } from "@/components/store-provider"
import { AddAuthorDialog } from "@/components/authors/add-author-dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function AuthorsPage() {
    const { authors } = useStore()

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">작가 관리</h2>
                    <p className="text-muted-foreground">
                        등록된 작가 리스트와 연락처, 정산 정보를 관리합니다.
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <AddAuthorDialog />
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>등록 작가 목록</CardTitle>
                    <CardDescription>총 {authors.length}명의 작가가 등록되어 있습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">이름</TableHead>
                                <TableHead>이메일</TableHead>
                                <TableHead>연락처</TableHead>
                                <TableHead>정산 계좌</TableHead>
                                <TableHead>비고</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {authors.length > 0 ? (
                                authors.map((author) => (
                                    <TableRow key={author.id}>
                                        <TableCell className="font-medium">{author.name}</TableCell>
                                        <TableCell>{author.email}</TableCell>
                                        <TableCell>{author.phoneNumber}</TableCell>
                                        <TableCell>{author.bankAccount || "-"}</TableCell>
                                        <TableCell className="text-muted-foreground">{author.description || "-"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        등록된 작가가 없습니다.
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
