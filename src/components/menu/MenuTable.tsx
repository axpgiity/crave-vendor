import React from 'react';
import { MenuItem } from '../../types';
import { CheckCircle2, AlertCircle, Pencil, Trash2 } from 'lucide-react';

interface MenuTableProps {
  menuItems: MenuItem[];
  onToggleAvailability: (itemId: number) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: number) => void;
}

export const MenuTable: React.FC<MenuTableProps> = ({
  menuItems,
  onToggleAvailability,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {menuItems.map(item => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{item.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">₹{item.price.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => onToggleAvailability(item.id)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    item.available
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.available ? (
                    <><CheckCircle2 className="h-4 w-4 mr-1" /> Available</>
                  ) : (
                    <><AlertCircle className="h-4 w-4 mr-1" /> Unavailable</>
                  )}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => onEditItem(item)}
                    className="text-primary hover:text-primary-dark"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};