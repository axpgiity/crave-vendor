import React from 'react';
import { Order } from '../../types';
import { OrderItem } from './OrderItem';

interface OrderListProps {
  orders: Order[];
  onUpdateStatus: (orderId: number, status: Order['status']) => void;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateStatus }) => {
  // Filter out completed orders
  const activeOrders = orders.filter(order => order.status !== 'completed');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Active Orders</h2>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <ul role="list" className="divide-y divide-gray-200">
          {activeOrders.map(order => (
            <OrderItem key={order.id} order={order} onUpdateStatus={onUpdateStatus} />
          ))}
        </ul>
      </div>
    </div>
  );
};