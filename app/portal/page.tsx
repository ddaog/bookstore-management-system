"use client"

import { useStore } from "@/components/store-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function PortalLoginPage() {
    const { inventory } = useStore()
    const router = useRouter()

    // Get unique authors
    const authors = Array.from(new Set(inventory.map(i => i.author))).filter(a => a !== 'N/A')
    const [selectedAuthor, setSelectedAuthor] = useState<string>("")

    const handleLogin = () => {
        if (!selectedAuthor) return
        // Encode for URL safety
        router.push(`/portal/${encodeURIComponent(selectedAuthor)}`)
    }

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>작가 포털</CardTitle>
                    <CardDescription>판매 내역과 재고 현황을 확인하세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">작가 선택</label>
                        <Select onValueChange={setSelectedAuthor}>
                            <SelectTrigger>
                                <SelectValue placeholder="이름을 선택해주세요" />
                            </SelectTrigger>
                            <SelectContent>
                                {authors.map(author => (
                                    <SelectItem key={author} value={author}>{author}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full" onClick={handleLogin} disabled={!selectedAuthor}>
                        대시보드 접속
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
