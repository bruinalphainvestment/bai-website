import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId, studioBasePath } from './sanity/env';
import { schemaTypes } from './sanity/schemas';

const SINGLETON_TYPES = new Set(['siteSettings', 'homePage']);

export default defineConfig({
  name: 'bai-studio',
  title: 'Bruin Alpha Investment',
  basePath: studioBasePath,
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Pages')
              .id('pagesGroup')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem()
                      .title('Home Page')
                      .id('homePage')
                      .child(
                        S.document()
                          .schemaType('homePage')
                          .documentId('homePage'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('page').title('All Pages'),
                  ]),
              ),
            S.listItem()
              .title('Content')
              .id('contentGroup')
              .child(
                S.list()
                  .title('Content')
                  .items([
                    S.documentTypeListItem('committee').title('Committees'),
                    S.documentTypeListItem('foundingMember').title(
                      'Founding Members',
                    ),
                    S.documentTypeListItem('project').title('Projects'),
                    S.documentTypeListItem('event').title('Events'),
                    S.documentTypeListItem('faq').title('FAQs'),
                  ]),
              ),
            S.listItem()
              .title('Settings')
              .id('settingsGroup')
              .child(
                S.list()
                  .title('Settings')
                  .items([
                    S.listItem()
                      .title('Site Settings')
                      .id('siteSettings')
                      .child(
                        S.document()
                          .schemaType('siteSettings')
                          .documentId('siteSettings'),
                      ),
                  ]),
              ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin: typeof location === 'undefined' ? '' : location.origin,
        preview: '/',
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETON_TYPES.has(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETON_TYPES.has(context.schemaType)
        ? input.filter(
            ({ action }) =>
              action !== 'delete' &&
              action !== 'duplicate' &&
              action !== 'unpublish',
          )
        : input,
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(
            (template) => !SINGLETON_TYPES.has(template.templateId),
          )
        : prev,
  },
});
