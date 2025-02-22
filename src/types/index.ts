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
  status: "pending" | "confirmed" |"preparing" |"ready"| "rejected" | "completed";
  total_price: number;
  customer_id: string | null;
  customer: string;
  pick_up_time: string;
  created_at: string;
  vendor_id: string;
  items: OrderItem[];
}

export interface OrderItem {
  quantity: number;
  price: number;
  item: {
    id: number;
    name: string;
    veg: boolean;
  };
}

export interface CustomerDetails {
  customer_id: string;
  full_name: string;
  phonenumber: string;
}

export interface ShopDetails {
  name: string;
  description: string;
  openingHours: string;
  phone: string;
  image: Text;
  location: string;
}