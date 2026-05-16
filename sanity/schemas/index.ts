import type { SchemaTypeDefinition } from 'sanity';

import { aboutPage } from './aboutPage';
import { committee } from './committee';
import { committeesIndexPage } from './committeesIndexPage';
import { event } from './event';
import { eventsPage } from './eventsPage';
import { foundingMember } from './foundingMember';
import { homePage } from './homePage';
import { joinPage } from './joinPage';
import { project } from './project';
import { projectsPage } from './projectsPage';
import { siteSettings } from './siteSettings';
import { teamPage } from './teamPage';
import { trainingPage } from './trainingPage';

import { committeesTeaserSection } from './objects/committeesTeaserSection';
import { ctaSection } from './objects/ctaSection';
import { foundingTeamSection } from './objects/foundingTeamSection';
import { gallerySection } from './objects/gallerySection';
import { heroSection } from './objects/heroSection';
import { imageCalloutSection } from './objects/imageCalloutSection';
import { marqueeSection } from './objects/marqueeSection';
import { missionSection } from './objects/missionSection';
import { numberedListSection } from './objects/numberedListSection';
import { pageHero } from './objects/pageHero';
import { projectGridSection } from './objects/projectGridSection';
import { quoteSection } from './objects/quoteSection';
import { richTextSection } from './objects/richTextSection';
import { seo } from './objects/seo';
import { spacerSection } from './objects/spacerSection';
import { statsRowSection } from './objects/statsRowSection';
import { statsSection } from './objects/statsSection';
import { teamGridSection } from './objects/teamGridSection';
import { valuesSection } from './objects/valuesSection';

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,
  aboutPage,
  trainingPage,
  joinPage,
  eventsPage,
  projectsPage,
  teamPage,
  committeesIndexPage,
  committee,
  foundingMember,
  project,
  event,
  seo,
  pageHero,
  heroSection,
  missionSection,
  valuesSection,
  committeesTeaserSection,
  foundingTeamSection,
  marqueeSection,
  statsSection,
  ctaSection,
  richTextSection,
  imageCalloutSection,
  numberedListSection,
  statsRowSection,
  quoteSection,
  projectGridSection,
  teamGridSection,
  gallerySection,
  spacerSection,
];
