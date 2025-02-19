export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description: string;
  category: string;
}

export interface MenuItemFormData {
  name: string;
  price: string;
  description: string;
  category: string;
}

export interface Order {
  id: number;
  status: "pending" | "confirmed" | "rejected" | "completed" | "preparing" | "ready";
  total_price: number;
  needed_by: string;
  created_at: string;
  customer_name: string | null;
  customer_contact: string | null;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  total: number;
  timestamp: string;
}

export interface ShopDetails {
  name: string;
  description: string;
  openingHours: string;
  phone: string;
  image: Text;
  location: string;
}