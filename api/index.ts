import { Hono } from "hono";
import { handle } from "hono/vercel";
import {
  initSearchEngine,
  fuzzySearch,
  isSearchReady,
} from "../src/services/search";
import { DEFAULT_LIMIT } from "../constant";

export const config = {
  runtime: "edge",
};

initSearchEngine().catch((error : any) => {
  console.error("Failed to initialize search engine:", error);
});

const app = new Hono().basePath("/api");

app.get("/", async (c): Promise<Response> => {
  const startTime = performance.now();

  if (!isSearchReady()) {
    return c.json({ error: "Search service is initializing" }, 503);
  }

  const query = c.req.query("q");
  const limit = c.req.query("limit");

  if (!query) {
    return c.json({ error: 'Missing search query parameter "q"' }, 400);
  }

  const limitNumber = limit
    ? typeof Number(limit) === "number"
      ? Number(limit)
      : DEFAULT_LIMIT
    : DEFAULT_LIMIT;

  try {
    const results = fuzzySearch(query, limitNumber);
    return c.json({
      data: results,
      meta: {
        query,
        response_time_ms: Number((performance.now() - startTime).toFixed(3)),
      },
    });
  } catch (error) {
    console.error("Search failed:", error);
    return c.json({ error: "Search failed" }, 500);
  }
});

export default handle(app);
