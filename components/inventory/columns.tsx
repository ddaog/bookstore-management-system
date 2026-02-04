"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RestockDialog } from "./restock-dialog";
import { useState } from "react";

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    상품명
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "author",
        header: "작가/브랜드",
    },
    {
        accessorKey: "type",
        header: "구분",
        cell: ({ row }) => {
            const type = row.getValue("type") as string;
            const typeMap: Record<string, string> = {
                Independent: "독립서적",
                General: "일반서적",
                Goods: "소품",
            };
            return <Badge variant="outline">{typeMap[type] || type}</Badge>;
        },
    },
    {
        accessorKey: "method",
        header: "입고 방식",
        cell: ({ row }) => {
            const method = row.getValue("method") as string;
            const methodMap: Record<string, string> = {
                Purchase: "매입",
                Consignment: "위탁",
            };
            return (
                <Badge variant={method === 'Consignment' ? "secondary" : "default"}>
                    {methodMap[method] || method}
                </Badge>
            );
        }
    },
    {
        accessorKey: "supplyRate",
        header: "공급률",
        cell: ({ row }) => {
            const rate = row.getValue("supplyRate") as number;
            return <div className="text-center">{rate ? `${rate}%` : "-"}</div>;
        },
    },
    {
        accessorKey: "price",
        header: "가격",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("price"));
            const formatted = new Intl.NumberFormat("ko-KR", {
                style: "currency",
                currency: "KRW",
            }).format(amount);
            return <div className="font-medium">{formatted}</div>;
        },
    },
    {
        accessorKey: "stock",
        header: "재고",
        cell: ({ row }) => {
            const stock = parseFloat(row.getValue("stock"));
            let colorClass = "text-green-600";
            if (stock === 0) colorClass = "text-red-600 font-bold";
            else if (stock < 5) colorClass = "text-orange-500 font-bold";

            return <div className={colorClass}>{stock} ea</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const item = row.original;
            // eslint-disable-next-line
            const [open, setOpen] = useState(false)

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(item.id)}
                            >
                                Copy ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setOpen(true)}>
                                재입고 (Restock)
                            </DropdownMenuItem>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit item</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <RestockDialog item={item} open={open} onOpenChange={setOpen} />
                </>
            );
        },
    },
];
