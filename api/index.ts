import { Hono } from "hono";
import { handle } from "hono/vercel";
import { initSearchEngine, fuzzySearch, isSearchReady } from "../src/services/search.service";

export const config = {
  runtime: "edge",
};

// Initialize search engine when app starts
initSearchEngine().catch((error: any) => {
  console.error("Failed to initialize search engine:", error);
});

const app = new Hono().basePath("/api");

app.get("/", (c) => {
  return c.json({ message: "Hello Hono!" });
});

// Add fuzzy search endpoint
app.get("/search", (c) => {
  if (!isSearchReady()) {
    return c.json({ error: "Search service is initializing" }, 503);
  }

  const query = c.req.query("q");
  if (!query) {
    return c.json({ error: 'Missing search query parameter "q"' }, 400);
  }

  try {
    const results = fuzzySearch(query);
    return c.json(results);
  } catch (error) {
    console.error("Search failed:", error);
    return c.json({ error: "Search failed" }, 500);
  }
});

export default handle(app);
