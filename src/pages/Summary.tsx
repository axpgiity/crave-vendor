import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";
import { OrderList } from "../components/orders/OrderList"; // Import the OrderList component
import { Order } from "../types";

export function Summary() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    // Fetch initial orders
    fetchOrders();

    // Set up a real-time subscription to the orders table
    const subscription = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received:", payload);
          fetchOrders(); // Re-fetch orders whenever a change occurs
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchOrders() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: vendor, error: err } = await supabase
        .from("vendors")
        .select("user_id, vendor_id")
        .eq("user_id", userData.user.id)
        .single();

      if (!vendor) {
        console.error("Vendor not found");
        return;
      }

      const { data: ordersData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          order_id,
          status,
          total_price,
          pick_up_time,
          created_at,
          customer_id, 
          order_items (
            quantity,
            price,
            items (
              item_id,
              item_name,
              veg
            )
          )
        `
        )
        .neq("status", "completed")
        .eq("vendor_id", vendor.vendor_id)
        .order("created_at", { ascending: false });

      if (orderError) {
        console.error("Error fetching orders:", orderError);
        toast.error("Failed to fetch orders");
        return;
      }

      if (ordersData) {
        const transformedData = ordersData.map((order: any) => ({
          id: order.order_id,
          status: order.status,
          total_price: parseFloat(order.total_price),
          pick_up_time: order.pick_up_time,
          created_at: order.created_at,
          customer_id: order.customer_id,
          vendor_id: order.vendor_id,
          items: order.order_items.map((item: any) => ({
            quantity: item.quantity,
            price: parseFloat(item.price),
            item: {
              id: item.items.item_id,
              name: item.items.item_name,
              veg: item.items.veg,
            },
          })),
        }));

        setOrders(transformedData);
      }
    } catch (error) {
      console.log("Error fetching Orders :", error);
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(
    orderId: number,
    newStatus: Order["status"]
  ) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("order_id", orderId);

      if (error) throw error;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      toast.success("Order status updated successfully");
      // Refresh orders list if completed
      if (newStatus === "completed") {
        await fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Active Orders
        </h2>
        <p className="text-gray-600">
          You don't have any active orders at the moment.
        </p>
      </div>
    );
  }

  return <OrderList orders={orders} onUpdateStatus={handleUpdateStatus} />;
}
