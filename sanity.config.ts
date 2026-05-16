import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId, studioBasePath } from './sanity/env';
import { schemaTypes } from './sanity/schemas';

const SINGLETON_TYPES = new Set([
  'siteSettings',
  'homePage',
  'aboutPage',
  'trainingPage',
  'joinPage',
  'eventsPage',
  'projectsPage',
  'teamPage',
  'committeesIndexPage',
]);

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
              .title('🏠 Home Page')
              .id('homePage')
              .child(
                S.document()
                  .schemaType('homePage')
                  .documentId('homePage'),
              ),
            S.listItem()
              .title('👥 About Page')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage'),
              ),
            S.listItem()
              .title('🎓 Training Page')
              .id('trainingPage')
              .child(
                S.document()
                  .schemaType('trainingPage')
                  .documentId('trainingPage'),
              ),
            S.listItem()
              .title('📝 Join Page')
              .id('joinPage')
              .child(
                S.list()
                  .title('Join Page')
                  .items([
                    S.listItem()
                      .title('Page Content')
                      .id('joinPageContent')
                      .child(
                        S.document()
                          .schemaType('joinPage')
                          .documentId('joinPage'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('faq')
                      .title('FAQs')
                      .child(
                        S.documentTypeList('faq').title('FAQs'),
                      ),
                  ]),
              ),
            S.listItem()
              .title('📅 Events Page')
              .id('eventsPage')
              .child(
                S.list()
                  .title('Events Page')
                  .items([
                    S.listItem()
                      .title('Page Content')
                      .id('eventsPageContent')
                      .child(
                        S.document()
                          .schemaType('eventsPage')
                          .documentId('eventsPage'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('event')
                      .title('All Events'),
                  ]),
              ),
            S.listItem()
              .title('💼 Projects Page')
              .id('projectsPage')
              .child(
                S.list()
                  .title('Projects Page')
                  .items([
                    S.listItem()
                      .title('Page Content')
                      .id('projectsPageContent')
                      .child(
                        S.document()
                          .schemaType('projectsPage')
                          .documentId('projectsPage'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('project')
                      .title('All Projects'),
                  ]),
              ),
            S.listItem()
              .title('👨‍👩‍👧‍👦 Team Page')
              .id('teamPage')
              .child(
                S.list()
                  .title('Team Page')
                  .items([
                    S.listItem()
                      .title('Page Content')
                      .id('teamPageContent')
                      .child(
                        S.document()
                          .schemaType('teamPage')
                          .documentId('teamPage'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('foundingMember')
                      .title('Founding Members'),
                  ]),
              ),
            S.listItem()
              .title('🏛️ Committees')
              .id('committeesIndexPage')
              .child(
                S.list()
                  .title('Committees')
                  .items([
                    S.listItem()
                      .title('Index Page')
                      .id('committeesIndexPageContent')
                      .child(
                        S.document()
                          .schemaType('committeesIndexPage')
                          .documentId('committeesIndexPage'),
                      ),
                    S.divider(),
                    S.documentTypeListItem('committee')
                      .title('All Committees'),
                  ]),
              ),
            S.divider(),
            S.listItem()
              .title('⚙️ Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings'),
              ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin:
          typeof location === 'undefined'
            ? (process.env.NEXT_PUBLIC_SITE_URL ?? '')
            : location.origin,
        preview: '/',
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
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
