import { defineQuery } from 'next-sanity';

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    brandName,
    titleSuffix,
    slogan,
    "disclaimer": coalesce(disclaimerText, disclaimer_text),
    "uclaName": coalesce(uclaCompliantName, ucla_compliant_name),
    "mission": coalesce(missionStatement, mission_statement),
    applyUrl,
    clubEmail,
    instagramUrl,
    linkedinUrl,
    slackInviteUrl,
    navLinks,
    foundedYear,
    foundedTerm,
    defaultMetaDescription,
    defaultOgImage,
    organizationDescription,
    sameAs,
    errorCopy,
    "domainRenewal": coalesce(domainRenewalDate, domain_renewal_date)
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

export const sitemapCommitteesQuery = defineQuery(`
  *[_type == "committee" && defined(slug.current)] | order(order asc) {
    "slug": slug.current,
    _updatedAt
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
