---
title: "Case Studies Guardrails"
description: "Internal contributor instructions for managing the case studies content collection."
timeframe: "N/A"
tags: ["internal", "guardrail"]
impact:
  - "Instructional reference for curating the case studies library."
heroStat: "Guardrails maintained"
order: -1
internal: true
---

# AGENTS.md — Case Studies Content Guardrails

## Scope
These guidelines apply to every MDX file inside `apps/site/src/content/case-studies/`.

## Frontmatter Expectations
- Keep `title`, `description`, `timeframe`, `tags`, `impact`, `heroStat`, and `order` current. Update metadata whenever the narrative changes so the index page and impact callouts stay aligned.
- Write `impact` bullets as short, outcome-focused statements that pair a concrete metric with the capability that enabled it. Avoid vendor callouts unless they are essential to the story.
- Use `heroStat` for the single takeaway metric readers should remember.

## Body Structure & Tone
- Retain the four-section flow: `## Problem`, `## Approach`, `## Results`, `## Lessons Learned`. Add supporting subheadings only if they aid scannability.
- Lead with the real business or operational stakes before describing solutions. Favor active voice and crisp sentences over marketing hyperbole.
- When citing metrics, prefer rate- or latency-based measurements that map directly to reader outcomes, and ensure any percentages or counts align with the impact bullets and hero stat.

## Placeholder Entries
- When staking out future stories, set the frontmatter `timeframe` to `"TBD"`, include a `tags` entry of `"placeholder"`, and clearly flag the status in the description.
- Populate each `impact` bullet with language that signals forthcoming detail (e.g., "Impact narrative coming soon") while avoiding fabricated metrics.
- Keep the standard four-section structure in the body copy, but replace the paragraphs with succinct notes about the planned coverage so reviewers can validate scope at a glance.

## QA Checklist
- Proofread for tense consistency and remove deprecated terminology or architectural references.
- Verify that any new figures, timestamps, or partner counts have corresponding source data or subject-matter approval before committing.
- Confirm the timeframe in frontmatter matches the narrative era called out in the body copy.
- Run `pnpm lint` or the relevant content build command if copy edits introduce new MDX syntax or components.
- When retiring a case study, remove related assets and check for lingering references (index pages, navigation, cross-links) so readers never hit dead routes.
