import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { OrderList } from "../components/orders/OrderList"; // Import the OrderList component

interface Order {
  id: number;
  status: "pending" | "confirmed" | "rejected" | "completed";
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

export function Summary() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: vendor, error: err } = await supabase
        .from("vendors")
        .select("vendorid")
        .eq("userid", userData.user.id)
        .single();

      if (err) throw err;

      const { data: ordersData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("vendor_id", vendor.vendorid);

      if (orderError) throw orderError;

      setOrders(ordersData);
    } catch (error) {
      console.log("Error fetching Orders :", error);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <OrderList
      orders={orders}
      onUpdateStatus={(orderId, status) => {
        // Handle status update logic here
      }}
    />
  );
}
