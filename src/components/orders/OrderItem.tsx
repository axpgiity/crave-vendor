import React, { useEffect, useRef, useState } from "react";
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
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = (endTime: number) => {
    clearTimer(); // prevent duplicates

    const updateTimer = () => {
      const remainingTime = Math.max(
        0,
        Math.floor((endTime - Date.now()) / 1000)
      );
      setTimer(remainingTime);

      if (remainingTime <= 0) {
        clearTimer();
        localStorage.removeItem(`order_${order.id}_endTime`);
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);
  };

  // Initialize on mount
  useEffect(() => {
    const storedEndTime = localStorage.getItem(`order_${order.id}_endTime`);
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      const remaining = Math.floor((endTime - Date.now()) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
        startCountdown(endTime);
      } else {
        localStorage.removeItem(`order_${order.id}_endTime`);
      }
    }

    return clearTimer;
  }, []);

  // Watch for status change
  useEffect(() => {
    if (order.status === "preparing") {
      const existingEndTime = localStorage.getItem(`order_${order.id}_endTime`);
      if (!existingEndTime) {
        const endTime = Date.now() + Number(order.pick_up_time) * 60 * 1000;
        localStorage.setItem(`order_${order.id}_endTime`, endTime.toString());
        startCountdown(endTime);
      }
    } else {
      // Not preparing anymore
      clearTimer();
      setTimer(0);
      localStorage.removeItem(`order_${order.id}_endTime`);
    }

    return clearTimer;
  }, [order.status, order.pick_up_time]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerBoxColor = () => {
    if (timer <= 120) {
      return "bg-red-100 text-red-800 border-red-500";
    }
    return "bg-green-100 text-green-800 border-green-500";
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
        {order.status === "preparing" && (
          <div
            className={`inline-block px-3 py-1 rounded-lg border text-sm font-medium ${getTimerBoxColor()}`}
          >
            Timer: {formatTime(timer)}
          </div>
        )}
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
