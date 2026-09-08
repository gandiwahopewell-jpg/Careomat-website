import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { StlTableBlockRenderer, type StlTableBlockValue } from "./stl-table";
import { urlFor } from "@/sanity/lib/image";

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-6 leading-7 text-muted-foreground">{children}</p>,
    h2: ({ children, value }) => {
      const text = String(children || "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
      return (
        <h2 id={id} className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-foreground">
          {children}
        </h2>
      );
    },
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-6 mb-2 text-lg font-semibold text-foreground">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-primary pl-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 ml-6 list-disc space-y-2 text-muted-foreground">{children}</ul>,
    number: ({ children }) => <ol className="my-6 ml-6 list-decimal space-y-2 text-muted-foreground">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http://") || href.startsWith("https://");
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
        {children}
      </code>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      return (
        <figure className="my-8 overflow-hidden rounded-lg border bg-muted/30">
          <div className="relative aspect-video w-full">
            <Image
              src={urlFor(value).width(1200).height(675).fit("crop").auto("format").url()}
              alt={value.alt || "Article illustration"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="p-3 text-center text-xs text-muted-foreground border-t">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    stlTableBlock: ({ value }: { value: StlTableBlockValue }) => {
      return (
        <div className="my-8 overflow-hidden rounded-lg border bg-card p-2 shadow-xs">
          <StlTableBlockRenderer value={value} />
        </div>
      );
    },
  },
};

export function CustomPortableText({ value }: { value?: any[] }) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return null;
  }
  return <PortableText value={value} components={portableTextComponents} />;
}
