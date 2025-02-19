import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem, MenuItemFormData } from '../../types';
import { MenuItemForm } from './MenuItemForm';
import { MenuTable } from './MenuTable';

interface MenuListProps {
  menuItems: MenuItem[];
  isAddingItem: boolean;
  editingItemId: number | null;
  formData: MenuItemFormData;
  onToggleAvailability: (itemId: number) => void;
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (itemId: number) => void;
  onAddItem: () => void;
  onCancelEdit: () => void;
  onSubmitItem: (e: React.FormEvent) => void;
  onFormChange: (data: Partial<MenuItemFormData>) => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  menuItems,
  isAddingItem,
  editingItemId,
  formData,
  onToggleAvailability,
  onEditItem,
  onDeleteItem,
  onAddItem,
  onCancelEdit,
  onSubmitItem,
  onFormChange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
        <button
          onClick={onAddItem}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </button>
      </div>

      {(isAddingItem || editingItemId !== null) && (
        <MenuItemForm
          formData={formData}
          isEditing={editingItemId !== null}
          onSubmit={onSubmitItem}
          onChange={onFormChange}
          onCancel={onCancelEdit}
        />
      )}

      <MenuTable
        menuItems={menuItems}
        onToggleAvailability={onToggleAvailability}
        onEditItem={onEditItem}
        onDeleteItem={onDeleteItem}
      />
    </div>
  );
};