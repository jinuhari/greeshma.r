export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  title,
  description,
  author,
  ogTitle,
  ogDescription,
  ogImage,
  favicon,
  footerCopyright,
  footerTagline
}`;

export const navigationQuery = `*[_type == "navigation"][0]{
  logo,
  tagline,
  links[]{
    label,
    href
  }
}`;

export const heroSectionQuery = `*[_type == "heroSection"][0]{
  eyebrow,
  heading,
  description,
  ctaLabel,
  ctaHref,
  resumeUrl,
  stats[]{
    label,
    value
  },
  backgroundImage
}`;

export const marqueeSectionQuery = `*[_type == "marqueeSection"][0]{
  items[]{
    text
  }
}`;

export const skillsSectionQuery = `*[_type == "skillsSection"][0]{
  heading,
  groups[]{
    name,
    skills[]
  }
}`;

export const aboutSectionQuery = `*[_type == "aboutSection"][0]{
  heading,
  body,
  image,
  imageCaption
}`;

export const contactSectionQuery = `*[_type == "contactSection"][0]{
  heading,
  items[]{
    label,
    value,
    url,
    type
  }
}`;

export const footerSettingsQuery = `*[_type == "footerSettings"][0]{
  copyrightText,
  tagline
}`;

export const errorPageQuery = `*[_type == "errorPage"][0]{
  notFoundEyebrow,
  notFoundHeading,
  notFoundMessage,
  notFoundCta,
  errorEyebrow,
  errorHeading,
  errorCta
}`;

export const caseStudiesQuery = `*[_type == "caseStudy"] | order(orderRank asc){
  _id,
  slug,
  number,
  year,
  title,
  kicker,
  coverImage,
  role,
  summary,
  outcomes[]{
    label,
    value
  },
  tone,
  client,
  timeline,
  tools,
  liveUrl,
  "sections": sections[]{
    _type == "textSection" => {
      _type,
      title,
      content
    },
    _type == "imageSection" => {
      _type,
      image,
      caption,
      fullBleed
    },
    _type == "imageTextSection" => {
      _type,
      title,
      content,
      image,
      imagePosition
    }
  }
}`;

export const caseStudyBySlugQuery = `*[_type == "caseStudy" && slug.current == $slug][0]{
  _id,
  slug,
  number,
  year,
  title,
  kicker,
  coverImage,
  role,
  summary,
  outcomes[]{
    label,
    value
  },
  tone,
  client,
  timeline,
  tools,
  liveUrl,
  "sections": sections[]{
    _type == "textSection" => {
      _type,
      title,
      content
    },
    _type == "imageSection" => {
      _type,
      image,
      caption,
      fullBleed
    },
    _type == "imageTextSection" => {
      _type,
      title,
      content,
      image,
      imagePosition
    }
  }
}`;

export const archiveItemsQuery = `*[_type == "archiveItem"] | order(orderRank asc){
  _id,
  label,
  category,
  year,
  medium,
  aspectRatio,
  image
}`;

export const timelineItemsQuery = `*[_type == "timelineItem"] | order(orderRank asc){
  _id,
  year,
  title,
  where
}`;

export const allContentQuery = `{
  "siteSettings": ${siteSettingsQuery},
  "navigation": ${navigationQuery},
  "hero": ${heroSectionQuery},
  "marquee": ${marqueeSectionQuery},
  "skills": ${skillsSectionQuery},
  "about": ${aboutSectionQuery},
  "contact": ${contactSectionQuery},
  "footer": ${footerSettingsQuery},
  "errorPage": ${errorPageQuery},
  "caseStudies": ${caseStudiesQuery},
  "archiveItems": ${archiveItemsQuery},
  "timelineItems": ${timelineItemsQuery}
}`;
