---
title: "Blog post content guardrails"
summary: "Instructions for drafting and shipping posts inside the content collection."
date: "2025-01-01"
tags:
  - meta
  - guardrails
draft: true
---

# AGENTS.md — Blog Post Content

## Scope
Applies to everything inside `apps/site/src/content/posts/` (including new posts, assets references, and helper docs).

## Voice & Metadata
- Mirror the security-platform practitioner tone established on the Writing index—actionable, empathetic, and grounded in real
team leadership lessons.
- Every post must include `title`, `summary`, `date`, `tags`, and `draft` fields in the frontmatter. Use ISO `YYYY-MM-DD` dates.
- Prefer MDX when you need components, callouts, or charts. Keep Markdown lean and readable when prose alone tells the story.

## Publishing Breadcrumbs
- Follow the step-by-step flow in `apps/site/src/content/posts/README.md` for drafting, previewing, and shipping posts.
- Store images in `apps/site/public/images/posts/<slug>/` and reference them via the `heroImage` field or Astro `<Image />` component.
- When marking a post ready for publication, flip `draft: false` in the same commit that addresses review feedback.

## QA Loop
- Run `pnpm --filter site build` before requesting review.
- Manually preview the new post at 375px, 768px, and ≥1280px widths to confirm typography and media scale correctly.
