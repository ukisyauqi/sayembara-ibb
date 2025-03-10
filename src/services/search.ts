import Fuse from "fuse.js";
import { THRESHOLD } from "../../constant";

interface Location {
  id: number;
  district_name: string;
  city_name: string;
  province_name: string;
}

let fuseInstance: Fuse<Location> | null = null;

export async function initSearchEngine() {
  try {
    const locations = await loadLocationsFromDB();
    fuseInstance = new Fuse(locations, {
      keys: ["district_name", "city_name", "province_name"],
      threshold: THRESHOLD,
      isCaseSensitive: false,
      shouldSort: true,
      minMatchCharLength: 2,
      includeScore: true,
    });
    console.log("Search engine initialized successfully");
  } catch (error) {
    console.error("Search engine initialization failed:", error);
    throw error;
  }
}

export function fuzzySearch(query: string, limit: number): Location[] {
  if (!fuseInstance) throw new Error("Search engine not initialized");

  return fuseInstance
    .search(query)
    .slice(0, limit)
    .map((result) => {
      return {
        ...result.item,
        score: result.score?.toFixed(5),
      };
    });
}

export function isSearchReady() {
  return !!fuseInstance;
}

async function loadLocationsFromDB(): Promise<Location[]> {
  try {
    const locationsData = require("../../data/location.json");
    return locationsData;
  } catch (error) {
    console.error("Failed to load locations:", error);
    throw error;
  }
}
