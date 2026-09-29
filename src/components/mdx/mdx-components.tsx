import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";

function MdxLink({ href = "", children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  a: MdxLink,
  // Usage in MDX: <Figure src="/images/x.png" alt="..." width={1200} height={800} caption="..." />
  Figure: ({
    caption,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption?: string;
  }) => (
    <figure>
      <Image alt={alt} {...props} className="rounded-2xl" />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ),
};
