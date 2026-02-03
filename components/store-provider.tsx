"use client";

import React, { createContext, useContext, useState } from "react";
import { Item, Sale, EntryRequest, Settlement, Author, RestockRecord } from "@/lib/types";
import { initialInventory, initialSales, initialRequests, initialSettlements, initialAuthors } from "@/lib/data";

interface StoreContextType {
    authors: Author[];
    inventory: Item[];
    sales: Sale[];
    requests: EntryRequest[];
    settlements: Settlement[];
    restocks: RestockRecord[]; // Add restocks
    addAuthor: (author: Author) => void;
    addItem: (item: Item) => void;
    addSale: (sales: Sale[]) => void;
    addRestock: (record: RestockRecord) => void; // Add method
    updateRequestStatus: (id: string, status: EntryRequest['status']) => void;
    updateSettlementStatus: (id: string, status: Settlement['status']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [authors, setAuthors] = useState<Author[]>(initialAuthors);
    const [inventory, setInventory] = useState<Item[]>(initialInventory);
    const [sales, setSales] = useState<Sale[]>(initialSales);
    const [requests, setRequests] = useState<EntryRequest[]>(initialRequests);
    const [settlements, setSettlements] = useState<Settlement[]>(initialSettlements);
    const [restocks, setRestocks] = useState<RestockRecord[]>([]); // Initial empty

    const addAuthor = (author: Author) => {
        setAuthors((prev) => [...prev, author]);
    };

    const addItem = (item: Item) => {
        setInventory((prev) => [...prev, item]);
    };

    const addSale = (newSales: Sale[]) => {
        // Add sale records
        setSales((prev) => [...newSales, ...prev]);

        // Deduct stock for each item
        setInventory((prev) => {
            const newInventory = prev.map((item) => {
                const saleItem = newSales.find(s => s.itemId === item.id);
                if (saleItem) {
                    return { ...item, stock: Math.max(0, item.stock - saleItem.quantity) };
                }
                return item;
            });
            return newInventory;
        });
    };

    const addRestock = (record: RestockRecord) => {
        setRestocks((prev) => [...prev, record]);
        setInventory((prev) =>
            prev.map(item =>
                item.id === record.itemId
                    ? { ...item, stock: item.stock + record.quantity }
                    : item
            )
        );
    };

    const updateRequestStatus = (id: string, status: EntryRequest['status']) => {
        setRequests((prev) =>
            prev.map((req) => (req.id === id ? { ...req, status } : req))
        );
    };

    const updateSettlementStatus = (id: string, status: Settlement['status']) => {
        setSettlements((prev) =>
            prev.map((set) => (set.id === id ? { ...set, status } : set))
        );
    };

    return (
        <StoreContext.Provider
            value={{
                authors,
                inventory,
                sales,
                requests,
                settlements,
                restocks,
                addAuthor,
                addItem,
                addSale,
                addRestock,
                updateRequestStatus,
                updateSettlementStatus,
            }}
        >
            {children}
        </StoreContext.Provider>
    );
}

export function useStore() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
