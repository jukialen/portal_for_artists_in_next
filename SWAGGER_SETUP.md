# API Documentation Setup

This directory contains the Swagger/OpenAPI documentation for the Portal for Artists API.

## Files

- **`page.tsx`** - The main documentation page with Swagger UI
- **`layout.tsx`** - Layout configuration for the documentation page
- **`../api/docs/route.ts`** - API endpoint that serves the OpenAPI specification
- **`../swagger.yaml`** - OpenAPI specification in YAML format

## Accessing the Documentation

The API documentation is available at:

```
http://localhost:3000/api-docs
```

## Features

✅ **Interactive API Explorer** - Test endpoints directly from the UI
✅ **Complete Endpoint Documentation** - All 29 API endpoints documented
✅ **Request/Response Examples** - See expected payload structures
✅ **Authentication Info** - Learn about required headers and auth methods
✅ **Tag-Based Organization** - Endpoints grouped by feature (Friends, Files, Comments, Likes, etc.)

## Adding New Endpoints

To document a new endpoint:

1. Open `src/app/api/swagger.yaml`
2. Add your endpoint path under the `paths:` section
3. Include:
   - `summary` - Short description
   - `description` - Detailed explanation
   - `parameters` - Query/path parameters
   - `requestBody` - Request payload structure (if applicable)
   - `responses` - Possible response codes and formats
   - `tags` - Category for organization

Example:

```yaml
/api/your-endpoint:
  post:
    tags:
      - Your Category
    summary: Your endpoint description
    description: Detailed description of what it does
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            properties:
              param1:
                type: string
    responses:
      '201':
        description: Success response
```

## Technical Details

### Dependencies

- **swagger-ui-react** - React component for interactive documentation UI
- **swagger-jsdoc** - For documenting endpoints with JSDoc comments (optional)
- **js-yaml** - For parsing YAML specification file

### Architecture

1. **Specification File** (`swagger.yaml`) - OpenAPI 3.0.0 specification
2. **Docs API Route** (`api/docs/route.ts`) - Serves the specification as JSON
3. **Documentation Page** (`api-docs/page.tsx`) - Displays Swagger UI

### API Response Flow

```
User visits /api-docs
    ↓
page.tsx makes GET request to /api/docs
    ↓
route.ts reads and parses swagger.yaml
    ↓
Returns JSON specification
    ↓
Swagger UI renders interactive documentation
```

## Updating Documentation

After modifying `swagger.yaml`, the changes will be reflected immediately when you refresh the documentation page (no rebuild needed).

## Deployment

The documentation is automatically included in your deployment. Make sure the `swagger.yaml` file is included in your build artifacts.

## Standard Response Structure

Most endpoints follow these patterns:

### Success Response (2xx)
```json
{
  "data": { /* response data */ },
  "message": "Success"
}
```

### Error Response (4xx, 5xx)
```json
{
  "error": "Error message",
  "status": 400
}
```

## Security Notes

- The `/api-docs` endpoint is public (no authentication required)
- Set `robots.index: false` in the metadata to prevent search engine indexing
- API endpoints themselves are protected by their own authentication logic
- Never expose sensitive information in the specification file

## References

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger UI Documentation](https://github.com/swagger-api/swagger-ui)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
