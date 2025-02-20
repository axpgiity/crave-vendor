import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { ShopDetails } from "../types";
import { Store, Info, Clock, Phone, Image, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

export function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [shopDetails, setShopDetails] = useState<ShopDetails | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    openingHours: "",
    phone: "",
    location: "",
    image: "",
  });

  useEffect(() => {
    if (user) {
      fetchShopDetails();
    }
  }, [user]);

  //to fetch the shop details and set the intial form values
  const fetchShopDetails = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      // Fetch shop details using shop ID
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("userid", userData.user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No data found, create new shop details
          const { data: newShop, error: createError } = await supabase
            .from("vendor")
            .insert({
              userid: userData.user.id,
              name: "",
              location: "",
            })
            .select()
            .single();

          if (createError) throw createError;
          setShopDetails(newShop);
          setEditForm(newShop);
        } else {
          throw error;
        }
      } else {
        const transformedData = {
          name: data.name,
          description: data.location,
          openingHours: data.opening_hours,
          image: data.image,
          location: data.location,
          phone: data.phone,
        };
        setShopDetails(transformedData);
        setEditForm(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching shop details:", error);
      toast.error("Failed to fetch shop details");
    } finally {
      setLoading(false);
    }
  };

  const updateShopDetails = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;

      const { error } = await supabase
        .from("vendors")
        .update({
          name: editForm.name,
          image: editForm.image,
          location: editForm.location,
          phone: editForm.phone,
        })
        .eq("userid", userData.user.id);

      if (error) {
        throw error;
      }

      toast.success("Shop details updated successfully");
      fetchShopDetails();
    } catch (error: any) {
      console.error("Error updating shop details:", error);
      toast.error("Failed to update shop details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Vendor Profile
        </h2>
        <div className="space-y-6">
          <div className="grid gap-6">
            {editForm.image && (
              <div className="mt-2 flex justify-center">
                <div className="w-full h-52 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={editForm.image}
                    alt="Vendor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Other boxes to display the shop details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Store Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Store className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={editForm?.name || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Info className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={editForm?.description || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Opening Hours
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Clock className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={editForm.openingHours}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      openingHours: e.target.value,
                    })
                  }
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Phone className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <MapPin className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Image URL
              </label>

              {/* Image box to display the image-url */}
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Image className="h-4 w-4" />
                </span>
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm({ ...editForm, image: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full rounded-none rounded-r-md border-gray-300 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              className="w-full text-white py-2 px-4 rounded-md bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2"
              onClick={updateShopDetails}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
