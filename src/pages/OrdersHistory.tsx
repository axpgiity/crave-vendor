import React, { useState, useEffect } from "react";
import { Order } from "../types";
import { Search, Calendar, Filter } from "lucide-react";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">(
    "completed"
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: vendor } = await supabase
        .from("vendors")
        .select("vendor_id")
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
          customer_details (
            customer_id,
            full_name,
            phonenumber
          ),
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
        .eq("status", "completed")
        .eq("vendor_id", vendor.vendor_id)
        .order("created_at", { ascending: false });

      if (orderError) {
        console.error("Error fetching orders:", orderError);
        toast.error("Failed to fetch orders");
        return;
      }

      if (ordersData) {
        const transformedOrders = ordersData.map((order: any) => ({
          id: order.order_id,
          status: order.status,
          total_price: parseFloat(order.total_price),
          pick_up_time: order.pick_up_time,
          timestamp: order.created_at,
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

        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.items.some((item) =>
      item.item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesDate = dateFilter
      ? new Date(order.timestamp).toLocaleDateString() ===
        new Date(dateFilter).toLocaleDateString()
      : true;

    return matchesSearch && matchesDate;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Orders Found
        </h2>
        <p className="text-gray-600">
          You don't have any completed orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="bg-white p-4 shadow sm:rounded-lg">
          <h2 className="text-2xl font-bold text-orange-600">History</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>

          {/* Date filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                  <span className="flex-shrink-0 text-lg font-medium text-gray-900">
                    Order #{order.id}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    Completed
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(order.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">{item.quantity}x</span>{" "}
                        {item.item.name}
                      </div>
                      <div className="text-sm text-gray-900">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    Total Amount
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{order.total_price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
