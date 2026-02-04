export type BookType = 'Independent' | 'General' | 'Goods';
export type AcqMethod = 'Purchase' | 'Consignment';
export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface Author {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  bankAccount?: string; // e.g. "BankName 123-456-789"
  description?: string;
}

export interface Item {
  id: string;
  title: string;
  authorId: string; // Linked to Author
  authorName: string; // Denormalized for display convenience
  price: number;
  stock: number;
  type: BookType;
  method: AcqMethod;
  isbn?: string;
  entryDate: string;
  supplyRate?: number; // Integer percentage, e.g. 70 for 70%
}

export interface Sale {
  id: string;
  transactionId: string; // Group items in one purchase
  itemId: string;
  quantity: number;
  pricePerItem: number; // Snapshot price
  totalPrice: number;
  date: string; // ISO string
}

export interface EntryRequest {
  id: string;
  authorName: string;
  email: string;
  bookTitle: string;
  description: string;
  status: 'Pending' | 'Contacted' | 'Stocked' | 'Rejected';
  requestDate: string;
}


export interface Settlement {
  id: string;
  authorId: string; // Linked
  authorName: string;
  quarter: string; // e.g., "2025-Q1"
  totalSales: number;
  commission: number; // e.g., 30%
  payoutAmount: number;
  status: 'Pending' | 'Completed';
}

export interface RestockRecord {
  id: string;
  itemId: string;
  quantity: number;
  date: string; // ISO string
}
