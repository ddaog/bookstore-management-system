"use client"

import { DataTable } from "@/components/inventory/data-table";
import { columns } from "@/components/inventory/columns";
// import { initialInventory } from "@/lib/data";
import { useStore } from "@/components/store-provider";
import { AddItemDialog } from "@/components/inventory/add-item-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History } from "lucide-react";

export default function InventoryPage() {
    const { inventory } = useStore();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">재고 관리</h2>
                        <p className="text-muted-foreground">
                            모든 서적과 소품의 재고를 관리합니다.
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href="/inventory/history">
                            <History className="mr-2 h-4 w-4" />
                            재입고 내역
                        </Link>
                    </Button>
                    <AddItemDialog />
                </div>
            </div>
            <DataTable columns={columns} data={inventory} />
        </div>
    );
}
