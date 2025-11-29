"use client";

import { useState, useEffect } from "react";
import { MapPin, Star, Phone, ExternalLink, Clock, Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { bookmarkLocation } from "@/actions/petchat";

export default function ClinicSearch() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    searchNearbyClinics();
  }, []);

  const searchNearbyClinics = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Detected location:", latitude, longitude);

        try {
          // Load Google Places Library
          const { Place } = await google.maps.importLibrary("places");

          const request = {
            fields: [
              "displayName",
              "formattedAddress",
              "rating",
              "userRatingCount",
              "nationalPhoneNumber",
              "websiteURI",
              "regularOpeningHours",
              "location",
            ],
            locationRestriction: {
              center: { lat: latitude, lng: longitude },
              radius: 5000, // 5km radius
            },
            includedPrimaryTypes: ["veterinary_care"],
            maxResultCount: 20,
            rankPreference: "DISTANCE",
            language: "en",
          };

          const { places } = await Place.searchNearby(request);

          if (!places || places.length === 0) {
            setError("No veterinary clinics found within 5km");
            setLoading(false);
            return;
          }

          // Calculate distances and format data
          const clinicsWithDistance = places.map((p) => {
            const placeLat = typeof p.location.lat === "function" ? p.location.lat() : p.location.lat;
            const placeLng = typeof p.location.lng === "function" ? p.location.lng() : p.location.lng;

            const distance = calculateDistance(latitude, longitude, placeLat, placeLng);

            return {
              name: p.displayName,
              address: p.formattedAddress,
              distance: distance.toFixed(2),
              rating: p.rating || null,
              reviews: p.userRatingCount || 0,
              phone: p.nationalPhoneNumber || null,
              website: p.websiteURI || null,
              hours: p.regularOpeningHours?.weekdayDescriptions?.join(", ") || null,
              latitude: placeLat,
              longitude: placeLng,
            };
          });

          // Sort by distance and take top 5
          const nearbyClinics = clinicsWithDistance
            .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance))
            .slice(0, 5);

          setClinics(nearbyClinics);
          setLoading(false);
        } catch (err) {
          console.error("Places API error:", err);
          setError("Failed to fetch clinics. Check your internet connection.");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setError("Location access denied. Enable location permissions.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    console.log("Distance calc inputs:", { lat1, lon1, lat2, lon2 });

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log("Calculated distance:", distance, "km");
    return distance;
  };

  const toRad = (degrees) => degrees * (Math.PI / 180);

  const handleBookmark = async (clinic) => {
    try {
      await bookmarkLocation({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        website: clinic.website,
        notes: clinic.hours,
        latitude: clinic.latitude,
        longitude: clinic.longitude,
      });
      toast.success(`Bookmarked ${clinic.name}`);
    } catch (error) {
      console.error("Bookmark error:", error);
      toast.error("Failed to bookmark clinic");
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-emerald-900/20 border-emerald-500/30">
        <div className="flex items-center justify-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          <p className="text-emerald-400">Searching for nearby clinics...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-900/20 border-red-500/30">
        <p className="text-red-400">{error}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-emerald-400">
          Found {clinics.length} nearby veterinary clinic(s)
        </h3>
      </div>

      {clinics.map((clinic, idx) => (
        <Card
          key={idx}
          className="p-4 bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-500/30 hover:border-emerald-500/50 transition-all"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold text-emerald-400">{clinic.name}</h4>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{clinic.address}</span>
                </div>

                <p className="text-emerald-400 font-medium">
                  {clinic.distance} km away
                </p>

                {clinic.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>
                      {clinic.rating} ({clinic.reviews} reviews)
                    </span>
                  </div>
                )}

                {clinic.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a
                      href={`tel:${clinic.phone}`}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      {clinic.phone}
                    </a>
                  </div>
                )}

                {clinic.website && (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {clinic.hours && (
                  <div className="flex items-start gap-2 text-xs">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{clinic.hours}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={() => handleBookmark(clinic)}
              variant="ghost"
              size="icon"
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
              title="Bookmark clinic"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
