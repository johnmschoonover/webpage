# CMS Setup Guide (Keystatic)

This project uses [Keystatic](https://keystatic.com) as a Git-based CMS. It allows you to edit content locally or in production (via GitHub integration).

## 1. Local Development

In local development, Keystatic runs in "Local Mode". It reads and writes files directly to your `apps/site/src/content` directory.

1.  Run the development server:
    ```bash
    pnpm dev
    ```
2.  Visit `http://localhost:4321/keystatic`.
3.  Make changes and save. The changes will be reflected immediately in your local file system (and Git).

## 2. Production Setup (Cloudflare Pages)

In production (and Cloudflare Previews), Keystatic runs in "GitHub Mode". It authenticates with GitHub and commits changes to your repository.

To enable this, you must configure a **GitHub App**.

### Step 1: Create a GitHub App

1.  Go to [GitHub Developer Settings > GitHub Apps](https://github.com/settings/apps) and click **New GitHub App**.
2.  **GitHub App Name**: `theschoonover-cms` (or similar).
3.  **Homepage URL**: `https://theschoonover.net`
4.  **Callback URL**: `https://theschoonover.net/keystatic/api/github/oauth/callback`
    *   *Note: This URL must match your production domain exactly.*
5.  **Webhook URL**: Uncheck "Active" (not needed).
6.  **Repository permissions**:
    *   **Contents**: `Read and write` (to commit changes).
    *   **Metadata**: `Read-only` (default).
7.  **Subscribe to events**: None required.
8.  **Where can this installation be used?**: "Only on this account".
9.  Click **Create GitHub App**.

### Step 2: Get Credentials

1.  On the App settings page, find the **Client ID** (e.g., `Iv1...`).
2.  Generate a **Client Secret** and copy it immediately.

### Step 3: Configure Cloudflare Pages

1.  Go to your Cloudflare Dashboard > Pages > `site` (or your project name).
2.  Go to **Settings > Environment variables**.
3.  Add the following variables to both **Production** and **Preview** environments (if applicable, see below):
    *   `KEYSTATIC_GITHUB_CLIENT_ID`: (Your Client ID)
    *   `KEYSTATIC_GITHUB_CLIENT_SECRET`: (Your Client Secret)
4.  **Redeploy** your site for the variables to take effect.

### Step 4: Install the App

1.  Go back to your GitHub App settings.
2.  Click **Install App** in the sidebar.
3.  Install it on your account and select the `johnmschoonover/webpage` repository.

## 3. Preview Environments

By default, the GitHub App only allows **one** Callback URL. This means authentication will **fail** on Cloudflare Preview deployments (e.g., `https://<sha>.project.pages.dev/keystatic`) because the callback domain doesn't match `theschoonover.net`.

**Workarounds:**
1.  **Use Localhost:** For most changes, use `pnpm dev` locally.
2.  **Use Production:** For final edits, use the production CMS.
3.  **Keystatic Cloud (Optional):** If you need CMS access on every preview branch, consider connecting [Keystatic Cloud](https://keystatic.com/docs/cloud), which proxies authentication.

## 4. Troubleshooting

*   **"Client ID not found":** Ensure environment variables are set in Cloudflare and the site has been redeployed.
*   **"Redirect URI mismatch":** You are trying to log in from a URL that doesn't match the Callback URL in your GitHub App settings.
