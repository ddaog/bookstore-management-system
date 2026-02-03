"use client"

import { SettlementTable } from "@/components/settlement/settlement-table";
import { columns } from "@/components/settlement/columns";
import { useStore } from "@/components/store-provider";

export default function SettlementPage() {
    const { settlements } = useStore();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">정산 관리</h2>
                        <p className="text-muted-foreground">
                            위탁 작가들의 분기별 정산을 관리합니다.
                        </p>
                    </div>
                </div>
            </div>
            <SettlementTable columns={columns} data={settlements} />
        </div>
    );
}
