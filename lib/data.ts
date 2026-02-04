import { Item, Sale, EntryRequest, Settlement, Author } from './types';

// Dummy Data
export const initialAuthors: Author[] = [
    {
        id: "auth-001",
        name: "김민",
        email: "kim@example.com",
        phoneNumber: "010-1234-5678",
        bankAccount: "카카오뱅크 3333-01-2345678",
        description: "일상의 소소함을 그리는 작가"
    },
    {
        id: "auth-002",
        name: "박문",
        email: "park@example.com",
        phoneNumber: "010-9876-5432",
        bankAccount: "국민은행 123-456-789012",
        description: "SF 소설가"
    },
    {
        id: "auth-general",
        name: "일반도서", // System placeholder for general books
        email: "",
        phoneNumber: "",
        bankAccount: "",
    }
];

export const initialInventory: Item[] = [
    {
        id: "item-1",
        title: "여름의 맛",
        authorId: "auth-001",
        authorName: "김민",
        price: 15000,
        stock: 5,
        type: "Independent",
        method: "Consignment",
        entryDate: "2025-01-10",
    },
    {
        id: "item-2",
        title: "우주의 끝",
        authorId: "auth-002",
        authorName: "박문",
        price: 18000,
        stock: 3,
        type: "Independent",
        method: "Purchase",
        entryDate: "2025-01-12",
    },
    {
        id: "item-3",
        title: "트렌드 코리아 2025",
        authorId: "auth-general",
        authorName: "김난도 외",
        price: 22000,
        stock: 10,
        type: "General",
        method: "Purchase",
        entryDate: "2025-01-15",
    },
    {
        id: "goods-1",
        title: "공간과몰입 머그컵",
        authorId: "auth-general",
        authorName: "공간과몰입",
        price: 12000,
        stock: 20,
        type: "Goods",
        method: "Purchase",
        entryDate: "2025-01-01",
    },
    ...Array.from({ length: 200 }).map((_, i) => ({
        id: `mock-item-${i + 1}`,
        title: `샘플 도서 ${i + 1} - ${["여름의", "우주의", "나의", "너의", "우리의"][i % 5]} ${["기록", "생각", "하루", "여행", "꿈"][i % 5]}`,
        authorId: "auth-001",
        authorName: ["김민", "박문", "이서윤", "최지훈"][i % 4],
        price: [10000, 12000, 15000, 18000, 20000][i % 5],
        stock: Math.floor(Math.random() * 20),
        type: ["Independent", "General", "Goods"][Math.floor(Math.random() * 3)] as "Independent" | "General" | "Goods",
        method: ["Consignment", "Purchase"][i % 2] as "Consignment" | "Purchase",
        entryDate: "2025-01-01",
    }))
];

export const initialSales: Sale[] = [
    {
        id: "sale-1",
        transactionId: "tx-1",
        itemId: "item-1",
        quantity: 1,
        pricePerItem: 15000,
        totalPrice: 15000,
        date: new Date().toISOString(),
    },
];

export const initialRequests: EntryRequest[] = [
    {
        id: "req-1",
        authorName: "이서윤",
        email: "lee@example.com",
        bookTitle: "새벽의 단상",
        description: "새벽에 쓴 시들을 모은 시집입니다.",
        status: "Pending",
        requestDate: "2025-02-01",
    }
];

export const initialSettlements: Settlement[] = [
    {
        id: "set-1",
        authorId: "auth-001",
        authorName: "김민",
        quarter: "2025-Q1",
        totalSales: 150000,
        commission: 45000,
        payoutAmount: 105000,
        status: "Pending",
    }
];
