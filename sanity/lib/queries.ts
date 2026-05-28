import { defineQuery } from 'next-sanity';

export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings"][0] {
    brandName,
    titleSuffix,
    slogan,
    "disclaimer": disclaimerText,
    "uclaName": uclaCompliantName,
    "mission": missionStatement,
    applyCtaLabel,
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
    "domainRenewal": domainRenewalDate
  }
`);

export const homePageQuery = defineQuery(`
  *[_type == "homePage"][0] {
    title,
    seo,
    _updatedAt,
    sections[] {
      _key,
      _type,
      ...
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
    _updatedAt,
    hero,
    mission,
    history,
    founderQuote,
    signatureTrip,
    valuesHeading,
    values,
    sections
  }
`);

export const trainingPageQuery = defineQuery(`
  *[_type == "trainingPage"][0] {
    title,
    seo,
    _updatedAt,
    hero,
    intro,
    curriculum,
    curriculumHeading,
    classHierarchy,
    sampleWeek,
    assessment,
    quarterlyProject,
    programs,
    signatureCertifications
  }
`);

export const joinPageQuery = defineQuery(`
  *[_type == "joinPage"][0] {
    title,
    seo,
    _updatedAt,
    hero,
    intro,
    applicationProcessHeading,
    applicationSteps,
    timelineHeading,
    timeline,
    applicationForm,
    faqHeading,
    faqs,
    contactHeading,
    contactLinks
  }
`);

export const eventsPageQuery = defineQuery(`
  *[_type == "eventsPage"][0] {
    title,
    seo,
    _updatedAt,
    hero,
    intro,
    upcomingHeading,
    competitionsHeading,
    externalCtaLabel,
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
    externalUrl,
    "committee": committee->{ _id, name, "slug": slug.current }
  }
`);

export const projectsPageQuery = defineQuery(`
  *[_type == "projectsPage"][0] {
    title,
    seo,
    _updatedAt,
    hero,
    intro,
    emptyState,
    statusLegendHeading,
    statusLegend
  }
`);

export const allProjectsQuery = defineQuery(`
  *[_type == "project" && showOnProjectsPage != false] | order(_createdAt asc) {
    _id,
    name,
    "slug": slug.current,
    summary,
    status,
    tags,
    "committee": committee->{ _id, name, "slug": slug.current }
  }
`);

export const teamPageQuery = defineQuery(`
  *[_type == "teamPage"][0] {
    title,
    seo,
    _updatedAt,
    hero,
    intro,
    foundingClassHeading,
    membersHeading,
    membersPlaceholder,
    alumniHeading,
    alumniPlaceholder
  }
`);

export const committeesIndexPageQuery = defineQuery(`
  *[_type == "committeesIndexPage"][0] {
    title,
    seo,
    _updatedAt,
    hero,
    intro,
    connectedByDesign,
    cardLearnHeading,
    cardCtaLabel
  }
`);

export const allCommitteesIndexQuery = defineQuery(`
  *[_type == "committee"] | order(order asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    learn,
    accentColor,
    order,
    directorPlaceholder,
    "directors": directors[]->{
      firstName,
      lastName,
      role
    },
    "director": director->{
      firstName,
      lastName,
      role
    }
  }
`);

export const committeeBySlugQuery = defineQuery(`
  *[_type == "committee" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    curriculum,
    curriculumEnabled,
    curriculumHeading,
    curriculumTerm,
    learn,
    learnHeading,
    differentiator,
    differentiatorHeading,
    signatureProjectsHeading,
    directorQuote,
    redirectsFrom,
    accentColor,
    order,
    directorPlaceholder,
    seo,
    _updatedAt,
    "directors": directors[]->{
      _id,
      firstName,
      lastName,
      role,
      committee,
      headshot,
      photoReleaseObtained,
      monogramOverride
    },
    "director": director->{
      _id,
      firstName,
      lastName,
      role,
      committee,
      headshot,
      photoReleaseObtained,
      monogramOverride
    },
    "projects": signatureProjects[]->{
      _id,
      name,
      "slug": slug.current,
      summary,
      status
    }
  }
`);

export const committeeSlugsQuery = defineQuery(`
  *[_type == "committee" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const committeeRedirectMapQuery = defineQuery(`
  *[_type == "committee" && defined(slug.current)] {
    "slug": slug.current,
    redirectsFrom
  }
`);

export const sitemapPagesQuery = defineQuery(`
  *[_type in [
    "homePage",
    "aboutPage",
    "teamPage",
    "projectsPage",
    "eventsPage",
    "trainingPage",
    "joinPage",
    "committeesIndexPage"
  ]] {
    _type,
    _updatedAt
  }
`);
