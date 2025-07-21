# [BUG] WordPress API Fallback Issues (#10)

## Summary
This document describes the changes made to improve the fallback and error handling logic for WordPress API integration in the project.

## Problem
Previously, when the WordPress API returned an error or an unexpected response (such as an HTML error page), the code attempted to parse the response as JSON, resulting in errors like:

```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Additionally, the actual error response from the API was not logged, making debugging difficult.

## Solution
The following improvements were made:

- **Safe JSON Parsing:** Introduced a `safeJsonParse` helper function to safely parse JSON responses and log the raw response body if parsing fails.
- **Detailed Error Logging:** When the API response is not OK, the response body is now logged for better debugging.
- **Consistent Fallbacks:** All API fetches now robustly fallback to sample data or empty arrays when errors occur.
- **Documentation:** Added comments to clarify fallback logic in the code.

## Affected File
- `src/lib/wordpress.ts`

## Key Changes
- Added `safeJsonParse` helper for robust JSON parsing and error logging.
- Updated `getPosts`, `getTags`, `getCategories`, and related functions to use the new helper and log error responses.
- Improved comments and fallback logic for clarity and reliability.

## How to Test
1. Set an invalid or unreachable `WORDPRESS_API_URL` in your environment.
2. Run the app and observe the console logs for detailed error messages.
3. The app should gracefully fallback to sample data or empty arrays without crashing.

---

**Related Issue:** [#10](https://github.com/your-repo/issues/10) 