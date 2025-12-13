import { config, fields, collection, singleton } from '@keystatic/core';
import { inline } from '@keystatic/core/content-components';
import React from 'react';

// In Prod (GitHub mode), paths are relative to repo root: apps/site/src/content/...
// In Dev (Local mode), paths are relative to CWD (apps/site): src/content/...
const isProd = import.meta.env.PROD;
const getPath = (path: string) => isProd ? `apps/site/${path}` : path;

export default config({
  storage: isProd
    ? {
        kind: 'github',
        repo: 'johnmschoonover/webpage',
      }
    : {
        kind: 'local',
      },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: isProd ? 'apps/site/src/content/posts/*' : 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        date: fields.date({ label: 'Date', validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        canonical: fields.text({ label: 'Canonical URL' }),
        updated: fields.date({ label: 'Updated Date' }),
        heroImage: fields.image({
          label: 'Hero Image',
          directory: getPath('public/images/posts'),
          publicPath: '/images/posts/',
        }),
        draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: getPath('public/images/posts'),
              publicPath: '/images/posts/',
            }
          },
          components: {
            Latex: inline({
              label: 'Latex',
              schema: {
                formula: fields.text({ label: 'Formula', multiline: true }),
                block: fields.checkbox({ label: 'Block Mode', defaultValue: false }),
              },
              ContentView: (props) => {
                return (
                  <span style={{ padding: '2px 4px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                    <code>{props.value.formula}</code>
                  </span>
                );
              }
            })
          }
        }),
      },
    }),
    caseStudies: collection({
      label: 'Case Studies',
      slugField: 'title',
      path: isProd ? 'apps/site/src/content/case-studies/*' : 'src/content/case-studies/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true, validation: { isRequired: true } }),
        timeframe: fields.text({ label: 'Timeframe', validation: { isRequired: true } }),
        tags: fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        impact: fields.array(fields.text({ label: 'Impact Item' }), {
            label: 'Impact',
            validation: { length: { min: 1 } }
        }),
        heroStat: fields.text({ label: 'Hero Stat' }),
        order: fields.number({ label: 'Order', defaultValue: 0 }),
        internal: fields.checkbox({ label: 'Internal', defaultValue: false }),
        content: fields.mdx({
          label: 'Content',
          options: {
            image: {
              directory: getPath('public/images/case-studies'),
              publicPath: '/images/case-studies/',
            }
          }
        }),
      },
    }),
  },
  singletons: {
    deliverables: singleton({
      label: 'Deliverables',
      path: isProd ? 'content/data/deliverables' : '../../content/data/deliverables',
      format: { data: 'json' },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            status: fields.text({ label: 'Status' }),
            summary: fields.text({ label: 'Summary', multiline: true }),
            highlights: fields.array(fields.text({ label: 'Highlight' }), {
              label: 'Highlights',
              itemLabel: (props) => props.value,
            }),
            year: fields.text({ label: 'Year' }),
            url: fields.url({ label: 'URL' }),
          }),
          {
            label: 'Deliverables',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
      },
    }),
  },
});
