import React from "react";
import { Order } from "../../types";
import { OrderStatusButtons } from "./OrderStatusButtons";

interface OrderItemProps {
  order: Order;
  onUpdateStatus: (orderId: number, status: Order["status"]) => void;
}

export const OrderItem: React.FC<OrderItemProps> = ({
  order,
  onUpdateStatus,
}) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <li className="p-4 sm:p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex-shrink-0 text-sm font-medium text-gray-900">
            Order #{order.id}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
              order.status
            )}`}
          >
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </span>
        </div>
        <span className="text-sm text-gray-500">{order.pick_up_time}</span>
      </div>
      <div className="mt-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items.map((order_items, index) => (
              <tr key={order_items.item.id || index}>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                  {order_items.item.name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                  {order_items.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ₹{order.total_price.toFixed(2)}
          </span>
          <OrderStatusButtons
            currentStatus={order.status}
            onUpdateStatus={(status) => onUpdateStatus(order.id, status)}
          />
        </div>
      </div>
    </li>
  );
};
