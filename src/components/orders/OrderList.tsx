import React from "react";
import { Order } from "../../types";
import { OrderItem } from "./OrderItem";

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrderList: React.FC<OrderListProps> = ({
  orders,
  onUpdateStatus,
}) => {
  const activeOrders = orders.filter((order) => order.status !== "completed");

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 shadow sm:rounded-lg">
        <h2 className="text-2xl font-bold text-orange-600">Active Orders</h2>
      </div>
      <ul role="list" className="space-y-2">
        {activeOrders.map((order) => (
          <OrderItem
            key={order.id}
            order={order}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </ul>
    </div>
  );
};
