import Fuse from "fuse.js";

interface Location {
  id: number;
  district_name: string;
  city_name: string;
  province_name: string;
}

let fuseInstance: Fuse<Location> | null = null;

const LIMIT = 10;
const THRESHOLD = 0.2;

export async function initSearchEngine() {
  const locations = await loadLocationsFromDB();
  fuseInstance = new Fuse(locations, {
    keys: ["district_name", "city_name", "province_name"],
    threshold: THRESHOLD,
    isCaseSensitive: false,
  });
}

export function fuzzySearch(query: string): Location[] {
  if (!fuseInstance) throw new Error("Search engine not initialized");

  return fuseInstance
    .search(query)
    .sort((a, b) => (a.score || 0) - (b.score || 0))
    .slice(0, LIMIT)
    .map((result) => {
      return {
        ...result.item,
        score: result.score?.toFixed(5),
      };
    });
}

async function loadLocationsFromDB(): Promise<Location[]> {
  const locationsData = require("../../data/location.json");
  return locationsData;
}
