"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, ShoppingCart, BookOpen, PenTool, Receipt, Menu, Users } from "lucide-react";

export function SideNav() {
    const pathname = usePathname();

    const routes = [
        {
            href: "/dashboard",
            label: "대시보드",
            icon: LayoutDashboard,
            active: pathname === "/dashboard",
        },
        {
            href: "/inventory",
            label: "재고 관리",
            icon: BookOpen,
            active: pathname === "/inventory",
        },
        {
            href: "/sales",
            label: "판매 기록",
            icon: ShoppingCart,
            active: pathname === "/sales",
        },
        {
            href: "/entry",
            label: "입고 요청 관리",
            icon: PenTool,
            active: pathname === "/entry",
        },
        {
            href: "/settlement",
            label: "정산 관리",
            icon: Receipt,
            active: pathname === "/settlement",
        },
        {
            href: "/authors",
            label: "작가 관리",
            icon: Users,
            active: pathname === "/authors",
        },
    ];

    return (
        <nav className="grid items-start gap-2">
            {routes.map((route, index) => (
                <Link
                    key={index}
                    href={route.href}
                >
                    <span
                        className={cn(
                            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors",
                            route.active ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50" : "text-neutral-500 dark:text-neutral-400"
                        )}
                    >
                        <route.icon className="mr-2 h-4 w-4" />
                        <span>{route.label}</span>
                    </span>
                </Link>
            ))}
        </nav>
    );
}
