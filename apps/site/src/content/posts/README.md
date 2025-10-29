---
title: "Writing & publishing flow"
summary: "Step-by-step guide for drafting, reviewing, and shipping theschoonover.net blog posts."
date: "2025-01-01"
tags:
  - meta
  - workflow
draft: true
---

# Writing & Publishing Flow

Use this guide whenever you draft a new blog post for theschoonover.net. It keeps the writing process predictable and makes sure
reviewers have everything they need in the pull request.

## 1. Start with a local branch
- Pull the latest `main` branch and create a feature branch named after the post (for example, `feat/post-zero-trust-layoffs`).
- Run `pnpm install` once after cloning the repository so the Astro content tooling is ready.

## 2. Create the post file
- Add a new `.mdx` (preferred) or `.md` file under `apps/site/src/content/posts/`.
- Use the filename `YYYY-MM-DD-slug.mdx` so posts sort chronologically (e.g., `2025-02-15-defense-in-depth.mdx`).
- Copy the starter frontmatter below and update every field:
  ```yaml
  ---
  title: "Post title that fits on two lines"
  summary: "One-sentence hook that explains the value of the post."
  date: 2025-02-15
  tags:
    - platform
    - telemetry
  draft: false
  ---
  ```
- Keep `draft: true` until the piece is ready for review. Setting it to `false` ships the post once merged.

## 3. Add assets when needed
- Save supporting images in `apps/site/public/images/posts/<slug>/` using web-friendly formats (`.jpg`, `.png`, `.webp`).
- Export large diagrams at two widths (`1600px` and `800px`) and use the Astro `<Image />` component with `srcset` metadata inside
the MDX file.
- Include descriptive alt text and, when appropriate, short captions below images.

## 4. Preview locally
- Run `pnpm --filter site dev` to preview the site. Confirm the new post appears in the Writing gallery and loads without console
errors.
- Scan the post at 375px, 768px, and ≥1280px widths to ensure headings, code blocks, and callouts wrap cleanly.

## 5. Open a pull request
- Commit the post, assets, and any supporting changes with a conventional commit message (e.g., `feat(posts): add telemetry north
star draft`).
- Push the branch and open a pull request summarizing the theme, reviewer asks, and any follow-up tasks.
- Confirm CI passes (`pnpm --filter site build`) before requesting review and note any known issues in the PR description.

## 6. Review and publish
- Address feedback in follow-up commits. Keep the history linear (squash before merge) so the content history stays readable.
- Flip `draft: false` and verify the date one last time before merging.
- After merging, check the production site to confirm the post renders correctly and images are optimized.

## Quick checklist before requesting review
- [ ] Frontmatter includes `title`, `summary`, `date`, `tags`, `canonical` (when applicable), and `draft`.
- [ ] Images live under `apps/site/public/images/posts/` and include alt text.
- [ ] `pnpm --filter site build` succeeds locally.
- [ ] The post reads well on mobile, tablet, and desktop.
- [ ] PR description links to any diagrams or research notes that informed the piece.
