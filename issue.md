# Hardening NGINX Configuration and Enabling HTTP Redirects

**Description:**

We need to update the NGINX configuration for the production and staging sites to improve security and fix connection handling. Based on a recent review, please implement the following changes to the `nginx.conf` (or site-specific config):

1. **Enable HTTP to HTTPS Redirect:**
   Add a server block listening on port 80 that catches all traffic for `theschoonover.net`, `www`, and `website_stage` and returns a 301 redirect to HTTPS. Currently, port 80 requests may time out.

2. **Optimize Proxy Buffering:**
   Remove `proxy_buffering off;` from the location blocks. Since we are serving a static Astro site, buffering should be enabled (default) to improve performance for clients with slower connections.

3. **Add Security Headers:**
   Inject the following headers into the SSL server blocks to mitigate clickjacking and MIME-sniffing:
   - `X-Frame-Options "SAMEORIGIN"`
   - `X-Content-Type-Options "nosniff"`
   - `Referrer-Policy "no-referrer-when-downgrade"`

4. **Dockerfile Hardening (Optional but Recommended):**
   Update the Dockerfile to switch to the non-root `nginx` user before the `CMD` instruction to prevent running the container as root.

**Acceptance Criteria:**

- `http://theschoonover.net` automatically redirects to `https://`.
- Security headers appear in response headers (verifiable via `curl -I`).
- Staging access remains restricted to the local subnet (`192.168.1.0/24`).
