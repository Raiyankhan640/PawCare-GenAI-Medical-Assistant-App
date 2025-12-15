import { Tool } from "langchain/tools";
import { Client } from "@googlemaps/google-maps-services-js";

export class VetClinicsNearMeTool extends Tool {
  constructor(apiKey) {
    super();
    this.name = "vet_clinics_near_me";
    this.description = "Find nearby veterinary clinics given a JSON input with 'lat' and 'lng' fields (e.g., {\"lat\": 37.7749, \"lng\": -122.4194}). Returns up to 5 clinics within 5km.";
    try {
      console.log("Initializing VetClinicsNearMeTool with API key:", apiKey ? "Set" : "Missing");
      this.client = new Client({});
      this.apiKey = apiKey;
      console.log("VetClinicsNearMeTool client initialized");
    } catch (err) {
      console.error("VetClinicsNearMeTool initialization failed:", err.message);
      throw err;
    }
  }

  async _call(input) {
    try {
      console.log("VetClinicsNearMeTool processing input:", input);
      
      // Validate and parse input
      let parsedInput;
      try {
        parsedInput = JSON.parse(input);
      } catch (parseErr) {
        console.error("Invalid JSON input to tool:", parseErr.message);
        return "Error: Input must be valid JSON with 'lat' and 'lng' fields. Example: {\"lat\": 37.7749, \"lng\": -122.4194}.";
      }

      const { lat, lng } = parsedInput;
      if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
        console.error("Invalid coordinates:", { lat, lng });
        return "Error: Invalid latitude or longitude provided. Please ensure they are valid numbers.";
      }

      const response = await this.client.placesNearby({
        params: {
          key: this.apiKey,
          location: { lat, lng },
          radius: 5000,
          keyword: "veterinary clinic",
        },
      });

      if (!response.data.results?.length) {
        console.log("No vet clinics found");
        return "No veterinary clinics found within 5km of your location. Try increasing the search radius or checking your coordinates.";
      }

      const resultText = response.data.results
        .slice(0, 5)
        .map((p, i) => `${i + 1}. ${p.name} 📍 ${p.vicinity || "No address available"} ⭐ ${p.rating || "N/A"} (${p.user_ratings_total || 0} reviews)`)
        .join("\n");
      console.log("VetClinicsNearMeTool response:", resultText);
      return resultText;
    } catch (err) {
      console.error("VetClinicsNearMeTool _call error:", err.message);
      if (err.message.includes('API key') || err.message.includes('quota')) {
        return "Error: Unable to fetch clinic data due to API issues. Please check your Google Maps API key.";
      }
      return `Error: Failed to find clinics. Details: ${err.message}`;
    }
  }
}