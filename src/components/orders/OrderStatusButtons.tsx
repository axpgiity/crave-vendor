import React from "react";
import { Order } from "../../types";

interface OrderStatusButtonsProps {
  currentStatus: Order["status"];
  onUpdateStatus: (status: Order["status"]) => void;
}

export const OrderStatusButtons: React.FC<OrderStatusButtonsProps> = ({
  currentStatus,
  onUpdateStatus,
}) => {
  const orderStatuses: Order["status"][] = [
    "pending",
    "preparing",
    "ready",
    "completed",
  ];

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "preparing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "ready":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
      {orderStatuses.map((status) => (
        <button
          key={status}
          onClick={() => onUpdateStatus(status)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors w-full sm:w-auto ${
            currentStatus === status
              ? `${getStatusColor(status)} ring-2 ring-offset-2 ring-${
                  status === "pending"
                    ? "yellow"
                    : status === "preparing"
                    ? "blue"
                    : status === "ready"
                    ? "green"
                    : "gray"
                }-400`
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      ))}
    </div>
  );
};
