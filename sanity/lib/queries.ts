import { groq } from "next-sanity";

export interface SanityCategory {
  _id?: string;
  title: string;
  slug?: string;
  color?: string;
  description?: string;
}

export interface SanityAuthor {
  _id?: string;
  name: string;
  slug?: string;
  avatar?: any;
  bio?: string;
}

export interface SanityPostAuthor {
  articleRole?: string;
  author?: SanityAuthor;
}

export interface SanityPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  readingTime?: number;
  publishedAt?: string;
  updatedAt?: string;
  coverImage?: any;
  body?: any[];
  tags?: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    shareImage?: any;
  };
  category?: SanityCategory;
  authors?: SanityPostAuthor[];
}

export interface SanityProject {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  sector?: string;
  service?: string;
  year?: string;
  outcome?: string;
  challenge?: string;
  approach?: string[];
  results?: string[];
  isCompleted?: boolean;
}

export const POSTS_QUERY = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    readingTime,
    publishedAt,
    coverImage,
    tags,
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      description
    },
    authors[]{
      articleRole,
      author->{
        _id,
        name,
        avatar,
        "slug": slug.current
      }
    }
  }
`;

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    readingTime,
    publishedAt,
    updatedAt,
    coverImage,
    body,
    tags,
    seo,
    category->{
      _id,
      title,
      "slug": slug.current,
      color,
      description
    },
    authors[]{
      articleRole,
      author->{
        _id,
        name,
        avatar,
        bio,
        "slug": slug.current
      }
    }
  }
`;

export const COMPLETED_PROJECTS_QUERY = groq`
  *[_type == "project" && defined(slug.current) && (isCompleted == true || !defined(isCompleted))] | order(year desc) {
    _id,
    title,
    "slug": slug.current,
    summary,
    sector,
    service,
    year,
    outcome,
    challenge,
    approach,
    results,
    isCompleted
  }
`;

export const PROJECT_BY_SLUG_QUERY = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    summary,
    sector,
    service,
    year,
    outcome,
    challenge,
    approach,
    results,
    isCompleted
  }
`;
