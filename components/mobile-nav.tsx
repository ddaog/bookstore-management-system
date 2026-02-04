"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { SideNav } from "@/components/side-nav"
import { useState } from "react"

export function MobileNav() {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px]">
                {/* Accessibility requirement: Title and Description */}
                <div className="sr-only">
                    <SheetTitle>Mobile Menu</SheetTitle>
                    <SheetDescription>Navigation links for mobile devices</SheetDescription>
                </div>

                <div className="flex h-full flex-col gap-2 p-4">
                    <div className="flex h-[60px] items-center border-b px-2 font-semibold text-lg">
                        공간과몰입
                    </div>
                    <div className="flex-1 overflow-auto py-2">
                        <SideNav />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
