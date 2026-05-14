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

export const aboutPageQuery = defineQuery(`
  *[_type == "aboutPage"][0] {
    title,
    seo,
    hero,
    mission,
    history,
    signatureTrip,
    values,
    sections
  }
`);

export const trainingPageQuery = defineQuery(`
  *[_type == "trainingPage"][0] {
    title,
    seo,
    hero,
    intro,
    curriculum,
    programs,
    signatureCertifications
  }
`);

export const joinPageQuery = defineQuery(`
  *[_type == "joinPage"][0] {
    title,
    seo,
    hero,
    intro,
    timeline,
    applicationForm,
    faqs,
    eligibilityHeading,
    eligibilityBullets
  }
`);

export const eventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0] {
    title,
    seo,
    hero,
    intro,
    upcomingEmptyState,
    pastEmptyState
  }
`);

export const allEventsQuery = defineQuery(`
  *[_type == "event"] | order(date asc) {
    _id,
    name,
    date,
    endDate,
    location,
    description,
    type,
    status,
    "externalUrl": coalesce(externalUrl, external_url),
    "committee": committee->{ _id, name, "slug": slug.current }
  }
`);

export const projectsPageQuery = defineQuery(`
  *[_type == "projectsPage"][0] {
    title,
    seo,
    hero,
    intro,
    emptyState,
    statusLegend
  }
`);

export const allProjectsQuery = defineQuery(`
  *[_type == "project"] | order(_createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    summary,
    status,
    tags,
    "committee": committee->{ _id, name, "slug": slug.current }
  }
`);
