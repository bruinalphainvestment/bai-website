import type { SchemaTypeDefinition } from 'sanity';

import { committee } from './committee';
import { event } from './event';
import { faq } from './faq';
import { foundingMember } from './foundingMember';
import { homePage } from './homePage';
import { page } from './page';
import { project } from './project';
import { siteSettings } from './siteSettings';

import { committeesTeaserSection } from './objects/committeesTeaserSection';
import { ctaSection } from './objects/ctaSection';
import { faqListSection } from './objects/faqListSection';
import { foundingTeamSection } from './objects/foundingTeamSection';
import { gallerySection } from './objects/gallerySection';
import { heroSection } from './objects/heroSection';
import { imageCalloutSection } from './objects/imageCalloutSection';
import { marqueeSection } from './objects/marqueeSection';
import { missionSection } from './objects/missionSection';
import { numberedListSection } from './objects/numberedListSection';
import { projectGridSection } from './objects/projectGridSection';
import { quoteSection } from './objects/quoteSection';
import { richTextSection } from './objects/richTextSection';
import { spacerSection } from './objects/spacerSection';
import { statsRowSection } from './objects/statsRowSection';
import { statsSection } from './objects/statsSection';
import { teamGridSection } from './objects/teamGridSection';
import { valuesSection } from './objects/valuesSection';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  homePage,
  // Documents
  page,
  committee,
  foundingMember,
  project,
  event,
  faq,
  // Section blocks
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
  faqListSection,
  projectGridSection,
  teamGridSection,
  gallerySection,
  spacerSection,
];
