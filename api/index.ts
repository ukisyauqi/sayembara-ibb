import { Hono } from "hono";
import { handle } from "hono/vercel";
import {
  initSearchEngine,
  fuzzySearch,
} from "../src/services/search";

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
  const startTime = performance.now();
  const query = c.req.query("q");
  if (!query) {
    return c.json({ error: 'Missing search query parameter "q"' }, 400);
  }

  try {
    const results = fuzzySearch(query);
    const responseTime = performance.now() - startTime;

    return c.json({
      data: results,
      meta: {
        query,
        response_time_ms: Number(responseTime.toFixed(3)),
      },
    });
  } catch (error) {
    const responseTime = performance.now() - startTime;
    console.error("Search failed:", error);
    return c.json(
      {
        error: "Search failed",
        meta: { response_time_ms: Number(responseTime.toFixed(3)) },
      },
      500
    );
  }
});

export default handle(app);
