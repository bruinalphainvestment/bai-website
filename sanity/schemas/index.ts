import type { SchemaTypeDefinition } from 'sanity';

import { committee } from './committee';
import { foundingMember } from './foundingMember';
import { homePage } from './homePage';
import { siteSettings } from './siteSettings';

import { committeesTeaserSection } from './objects/committeesTeaserSection';
import { ctaSection } from './objects/ctaSection';
import { foundingTeamSection } from './objects/foundingTeamSection';
import { heroSection } from './objects/heroSection';
import { marqueeSection } from './objects/marqueeSection';
import { missionSection } from './objects/missionSection';
import { statsSection } from './objects/statsSection';
import { valuesSection } from './objects/valuesSection';

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  homePage,
  committee,
  foundingMember,
  heroSection,
  missionSection,
  valuesSection,
  committeesTeaserSection,
  foundingTeamSection,
  marqueeSection,
  statsSection,
  ctaSection,
];
