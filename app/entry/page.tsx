"use client"

import { RequestTable } from "@/components/entry/request-table";
import { columns } from "@/components/entry/columns";
import { useStore } from "@/components/store-provider";

export default function EntryPage() {
    const { requests } = useStore();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">입고 요청 관리</h2>
                        <p className="text-muted-foreground">
                            작가의 입고 신청을 검토하고 관리합니다.
                        </p>
                    </div>
                </div>
            </div>
            <RequestTable columns={columns} data={requests} />
        </div>
    );
}
