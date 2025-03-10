# Location Search API

## Installation
```

npm install
npm run start

````

## API Usage

### Search Locations
```bash
GET /api?q={search_query}&limit={number}
````

Parameters:

- `q` (required): Search query string
- `limit` (optional): Maximum number of results (default: 10)

Example Request:

```bash
curl "http://localhost:3000/api?q=jakarta&limit=5"
```

Example Response:

```json
{
  "data": [
    {
      "id": 1,
      "district_name": "Menteng",
      "city_name": "Jakarta Pusat",
      "province_name": "DKI Jakarta",
      "score": "0.12345"
    }
  ],
  "meta": {
    "query": "jakarta",
    "response_time_ms": 123
  }
}
```
