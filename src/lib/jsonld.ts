// Connected Schema.org graph (SPEC §10.3). Every page emits a @graph whose nodes
// reference the same stable @ids, so answer engines resolve one entity: me.
import type {
  BlogPosting,
  BreadcrumbList,
  CreativeWork,
  FAQPage,
  Graph,
  Person,
  ProfilePage,
  Thing,
  WebSite,
} from "schema-dts";
import { profile, type FaqItem } from "@/data/profile";
import type { PostMeta, ProjectMeta } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export const ids = {
  person: absoluteUrl("/#person"),
  website: absoluteUrl("/#website"),
};

export function personNode(): Person {
  return {
    "@type": "Person",
    "@id": ids.person,
    name: profile.name,
    alternateName: profile.alternateNames.length ? profile.alternateNames : undefined,
    jobTitle: profile.jobTitle,
    description: profile.shortBio,
    url: absoluteUrl("/"),
    image: absoluteUrl(profile.image),
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location.city,
      addressCountry: profile.location.country,
    },
    sameAs: profile.socials.map((s) => s.href),
    knowsAbout: profile.knowsAbout,
    worksFor: profile.worksFor
      ? { "@type": "Organization", name: profile.worksFor.name, url: profile.worksFor.url }
      : undefined,
    alumniOf: profile.alumniOf?.map((o) => ({
      "@type": "EducationalOrganization" as const,
      name: o.name,
      url: o.url,
    })),
  };
}

export function websiteNode(): WebSite {
  return {
    "@type": "WebSite",
    "@id": ids.website,
    url: absoluteUrl("/"),
    name: profile.name,
    description: profile.pitch,
    publisher: { "@id": ids.person },
    inLanguage: "en",
  };
}

export function profilePageNode(path: string): ProfilePage {
  return {
    "@type": "ProfilePage",
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    isPartOf: { "@id": ids.website },
    mainEntity: { "@id": ids.person },
  };
}

export function breadcrumbNode(items: { name: string; path: string }[]): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqNode(faq: FaqItem[]): FAQPage {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question" as const,
      name: f.q,
      acceptedAnswer: { "@type": "Answer" as const, text: f.a },
    })),
  };
}

export function projectNode(p: ProjectMeta): CreativeWork {
  const url = absoluteUrl(`/projects/${p.slug}`);
  const base = {
    "@id": `${url}#work`,
    name: p.title,
    headline: p.title,
    description: p.tldr,
    abstract: p.summary,
    url,
    creator: { "@id": ids.person },
    dateCreated: p.date,
    dateModified: p.updated ?? p.date,
    keywords: [...p.stack, ...p.tags].join(", "),
    image: p.cover ? absoluteUrl(p.cover) : undefined,
  };
  // SoftwareSourceCode when there's a public repo, otherwise a generic CreativeWork.
  return p.links?.github
    ? { ...base, "@type": "SoftwareSourceCode", codeRepository: p.links.github }
    : { ...base, "@type": "CreativeWork" };
}

export function postNode(p: PostMeta): BlogPosting {
  const url = absoluteUrl(`/writing/${p.slug}`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: p.title,
    description: p.description,
    url,
    mainEntityOfPage: url,
    author: { "@id": ids.person },
    publisher: { "@id": ids.person },
    datePublished: p.date,
    dateModified: p.updated ?? p.date,
    keywords: p.tags.join(", "),
    isPartOf: { "@id": ids.website },
  };
}

/** Builds a page graph; person + website are always included so @id refs resolve. */
export function graph(...nodes: Thing[]): Graph {
  return {
    "@context": "https://schema.org",
    "@graph": [personNode(), websiteNode(), ...nodes],
  };
}
