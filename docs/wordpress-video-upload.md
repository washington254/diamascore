# WordPress video upload API

The WordPress plugin uploads each popup video to Diamas Core, which stores the
file in Cloudinary and writes its HTTPS URL to the matching `Customer` record.

## Required configuration

Set these server-side environment variables in Diamas Core:

```env
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
DIAMAS_WP_NONCE=use-a-long-random-shared-secret
```

`DIAMAS_WP_NONCE` must also be configured in the WordPress plugin. Keep it on
the WordPress server; do not put it in popup JavaScript or expose it to site
visitors.

## Upload request

Send a server-to-server `POST` request to:

```text
https://YOUR-DIAMAS-CORE-DOMAIN/api/videos/upload
```

Use `multipart/form-data` with these fields:

| Field | Value |
| --- | --- |
| `customerId` | The Diamas Core customer UUID created during plugin registration. |
| `variant` | `desktop` or `mobile`. |
| `video` | The uploaded video file. |

Include the shared secret in this header:

```text
x-diamas-nonce: YOUR_DIAMAS_WP_NONCE
```

A successful response is `200`:

```json
{
  "url": "https://res.cloudinary.com/.../video/upload/...",
  "variant": "desktop"
}
```

Uploads use a stable Cloudinary public ID per customer and variant. Uploading a
replacement desktop or mobile video overwrites that variant and updates the
stored URL in PostgreSQL.

## Reading the saved videos

The popup frontend can fetch the saved URLs from:

```text
GET /api/videos/:customerId
```

It returns:

```json
{
  "desktop": "https://...",
  "mobile": "https://..."
}
```
