"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Settlement } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStore } from "@/components/store-provider";

const ActionCell = ({ settlement }: { settlement: Settlement }) => {
    const { updateSettlementStatus } = useStore();

    if (settlement.status === 'Completed') {
        return <Badge variant="secondary">완료됨</Badge>;
    }

    return (
        <Button
            size="sm"
            onClick={() => updateSettlementStatus(settlement.id, 'Completed')}
        >
            지급 완료 처리
        </Button>
    );
};

export const columns: ColumnDef<Settlement>[] = [
    {
        accessorKey: "quarter",
        header: "분기",
    },
    {
        accessorKey: "authorName",
        header: "작가명",
    },
    {
        accessorKey: "totalSales",
        header: "총 판매액",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalSales"));
            return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
        }
    },
    {
        accessorKey: "commission",
        header: "수수료",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("commission"));
            return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount);
        }
    },
    {
        accessorKey: "payoutAmount",
        header: "지급액",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("payoutAmount")); // This is Sales - Commission usually
            return <div className="font-bold">{new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(amount)}</div>;
        }
    },
    {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return <Badge variant={status === 'Completed' ? "secondary" : "destructive"}>{status === 'Completed' ? '지급완료' : '미지급'}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell settlement={row.original} />,
    },
];
