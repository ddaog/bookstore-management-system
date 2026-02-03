"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EntryRequest } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useStore } from "@/components/store-provider";
import { useState } from "react";

// Separate component to use hooks
const ActionCell = ({ request }: { request: EntryRequest }) => {
    const { updateRequestStatus } = useStore();
    const [open, setOpen] = useState(false);

    if (request.status !== 'Pending') {
        return <span className="text-muted-foreground text-sm">처리완료</span>;
    }

    const handleApprove = () => {
        updateRequestStatus(request.id, 'Contacted');
        setOpen(false);
        // Simulate email
        // alert(`Email sent to ${request.email}`); 
    };

    const handleReject = () => {
        updateRequestStatus(request.id, 'Rejected');
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">검토하기</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>입고 요청 검토</DialogTitle>
                    <DialogDescription>
                        <b>{request.authorName}</b> 작가님의 <b>{request.bookTitle}</b> 입고 요청입니다.
                        <br />
                        이메일: {request.email}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 text-sm text-neutral-600">
                    <p><b>책 소개:</b></p>
                    <p>{request.description}</p>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="destructive" onClick={handleReject}>거절</Button>
                    <Button onClick={handleApprove}>승인 및 메일 발송</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export const columns: ColumnDef<EntryRequest>[] = [
    {
        accessorKey: "requestDate",
        header: "요청일",
    },
    {
        accessorKey: "authorName",
        header: "작가명",
    },
    {
        accessorKey: "bookTitle",
        header: "책 제목",
    },
    {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
            if (status === 'Contacted') variant = "default"; // Green-ish usually but default is black in Shadcn
            if (status === 'Rejected') variant = "destructive";
            if (status === 'Stocked') variant = "secondary";

            return <Badge variant={variant}>{status}</Badge>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell request={row.original} />,
    },
];
