import { defineQuery } from 'next-sanity';

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    ucla_compliant_name,
    slogan,
    mission_statement,
    disclaimer_text,
    applyUrl,
    clubEmail,
    instagramUrl,
    linkedinUrl,
    slackInviteUrl,
    domain_renewal_date
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0] {
    title,
    sections[] {
      _key,
      _type,
      ...
    }
  }
`);

export const allCommitteesQuery = defineQuery(`
  *[_type == "committee"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    order,
    accentColor,
    "director": director-> {
      _id,
      firstName,
      lastName,
      role,
      committee
    }
  }
`);

export const allFoundingMembersQuery = defineQuery(`
  *[_type == "foundingMember"] | order(lastName asc) {
    _id,
    firstName,
    lastName,
    role,
    committee,
    gradYear,
    bio,
    linkedinUrl,
    photoReleaseObtained,
    headshot,
    monogramOverride
  }
`);
