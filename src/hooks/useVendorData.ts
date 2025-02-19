import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MenuItem, Order, VendorProfile } from '../types';

export function useVendorData() {
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVendorData();
  }, []);

  const fetchVendorData = async () => {
    try {
      const { data: vendorData, error: vendorError } = await supabase
        .from('vendors')
        .select('*')
        .single();

      if (vendorError) throw vendorError;

      if (vendorData) {
        setVendorProfile({
          name: vendorData.name,
          description: vendorData.description || '',
          openingHours: vendorData.opening_hours || '',
          phone: vendorData.phone || ''
        });

        // Fetch menu items
        const { data: menuData, error: menuError } = await supabase
          .from('menu_items')
          .select('*')
          .eq('vendor_id', vendorData.id);

        if (menuError) throw menuError;

        setMenuItems(
          menuData.map(item => ({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            description: item.description || '',
            category: item.category || '',
            available: item.available
          }))
        );

        // Fetch orders with their items
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price,
              menu_items (
                name
              )
            )
          `)
          .eq('vendor_id', vendorData.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(
          ordersData.map(order => ({
            id: order.id,
            status: order.status,
            total: Number(order.total),
            timestamp: new Date(order.created_at).toLocaleString(),
            items: order.order_items.map((item: any) => ({
              name: item.menu_items.name,
              quantity: item.quantity
            }))
          }))
        );
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const updateVendorProfile = async (profile: VendorProfile) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({
          name: profile.name,
          description: profile.description,
          opening_hours: profile.openingHours,
          phone: profile.phone
        })
        .eq('id', supabase.auth.getUser());

      if (error) throw error;
      setVendorProfile(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const toggleItemAvailability = async (itemId: string) => {
    try {
      const item = menuItems.find(item => item.id === itemId);
      if (!item) return;

      const { error } = await supabase
        .from('menu_items')
        .update({ available: !item.available })
        .eq('id', itemId);

      if (error) throw error;

      setMenuItems(items =>
        items.map(item =>
          item.id === itemId ? { ...item, available: !item.available } : item
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return {
    vendorProfile,
    menuItems,
    orders,
    loading,
    error,
    updateVendorProfile,
    updateOrderStatus,
    toggleItemAvailability,
    refreshData: fetchVendorData
  };
}