"use client";

import { useState, useEffect } from "react";
import { MapPin, Plus, Trash2, ExternalLink, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  bookmarkLocation,
  getBookmarkedLocations,
  deleteBookmarkedLocation,
} from "@/actions/petchat";

export default function LocationBookmark() {
  const [open, setOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    website: "",
    notes: "",
  });

  useEffect(() => {
    if (open) {
      loadLocations();
    }
  }, [open]);

  const loadLocations = async () => {
    setLoading(true);
    try {
      const result = await getBookmarkedLocations();
      if (result.success) {
        setLocations(result.locations);
      }
    } catch (error) {
      toast.error("Failed to load locations");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.address.trim()) {
      toast.error("Name and address are required");
      return;
    }

    setLoading(true);
    try {
      const result = await bookmarkLocation(formData);

      if (result.success) {
        toast.success("Location bookmarked!");
        setFormData({
          name: "",
          address: "",
          phone: "",
          website: "",
          notes: "",
        });
        loadLocations();
      }
    } catch (error) {
      toast.error("Failed to bookmark location");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this location?")) return;

    setLoading(true);
    try {
      await deleteBookmarkedLocation(id);
      toast.success("Location removed");
      loadLocations();
    } catch (error) {
      toast.error("Failed to remove location");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-emerald-900/20 border-emerald-500/30 hover:bg-emerald-900/30 hover:border-emerald-500/50"
        >
          <MapPin className="h-4 w-4 text-emerald-400" />
          Bookmarked Locations ({locations.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-emerald-400">
            Veterinary Clinic Locations
          </DialogTitle>
        </DialogHeader>

        {/* Add New Location Form */}
        <form onSubmit={handleSubmit} className="space-y-4 border-b border-emerald-500/20 pb-6">
          <div>
            <Label htmlFor="name">Clinic Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., City Pet Hospital"
              required
              className="bg-background/50"
            />
          </div>
          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="123 Main St, City, State ZIP"
              required
              className="bg-background/50"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="bg-background/50"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                className="bg-background/50"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional information (hours, specialties, etc.)"
              className="bg-background/50"
              rows={2}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? "Adding..." : "Add Location"}
          </Button>
        </form>

        {/* Saved Locations List */}
        <div className="space-y-3 mt-6">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Saved Locations ({locations.length})
          </h3>

          {loading && locations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : locations.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No bookmarked locations yet
            </p>
          ) : (
            locations.map((loc) => (
              <div
                key={loc.id}
                className="p-4 border border-emerald-500/20 rounded-lg bg-emerald-900/10 hover:bg-emerald-900/20 transition-colors"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-emerald-400 mb-1">{loc.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{loc.address}</p>

                    <div className="flex flex-wrap gap-3 text-sm">
                      {loc.phone && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {loc.phone}
                        </div>
                      )}
                      {loc.website && (
                        <a
                          href={loc.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Website
                        </a>
                      )}
                    </div>

                    {loc.notes && (
                      <p className="text-xs text-muted-foreground mt-2 p-2 bg-background/30 rounded">
                        {loc.notes}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(loc.id)}
                    disabled={loading}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    title="Remove location"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
