# Changelog

## 2026-10-13
- Listed the published patent application US 2026/0277770 A1, "Systems and Methods for Anomaly Alerting for Data Feeds", on Deliverables and the homepage, linked to its Google Patents record.
- Updated the `data/profile.json` summary from "two in-flight patents" to one published application plus one in-flight filing.
- Homepage "Latest thinking" now skips draft posts, matching the Writing index and RSS feed.
- Fixed RSS item links, which pointed at `/writing/undefined/`.
- Restored spaces around inline links that Astro 7's default `compressHTML: 'jsx'` had removed ("Visit theGitHub profilefor") by setting `compressHTML: true`.
- Header fits every width with no horizontal scroll: the nav shows from 1024px, search is an icon below 1280px and stays available on phones, and the resume button reads "Resume" below 640px.
- The command palette overlay now covers the full viewport instead of only the header area.
- Long URLs in posts wrap instead of widening the page on phones.

## 2025-10-12
- Replaced speculative copy across About, Experience, Projects, Patents, and Contact with verified Source of Truth details.
- Introduced `data/profile.json` for canonical profile data and refreshed homepage to consume it.
- Added SITE_TODOs to track pending LinkedIn URL and patent filing details.
- Commit: TODO: update with final commit hash after merge.
