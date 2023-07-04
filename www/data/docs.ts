import toc from "../../docs/toc.ts";

export interface TableOfContentsEntry {
  slug: string;
  title: string;
  category?: string;
  href: string;
  file: string;
}

export interface TableOfContentsCategory {
  title: string;
  href: string;
  entries: TableOfContentsCategoryEntry[];
}

export interface TableOfContentsCategoryEntry {
  title: string;
  href: string;
}

export const TABLE_OF_CONTENTS: Record<string, TableOfContentsEntry> = {};
export const CATEGORIES: TableOfContentsCategory[] = [];

for (const parent in toc) {
  const rawEntry = toc[parent];
  const href = `/docs/${parent}`;
  const file = `docs/${parent}/index.md`;
  const entry = {
    slug: parent,
    title: rawEntry.title,
    href,
    file,
  };
  TABLE_OF_CONTENTS[parent] = entry;
  const category: TableOfContentsCategory = {
    title: rawEntry.title,
    href,
    entries: [],
  };
  CATEGORIES.push(category);
  const filteredPages = rawEntry.pages?.filter(([title, page]) =>
    title != null && page != null
  );
  if (filteredPages) {
    for (const [id, title] of filteredPages) {
      const slug = `${parent}/${id}`;
      const href = `/docs/${slug}`;
      const file = `docs/${slug}.md`;
      const entry = { slug, title, category: parent, href, file };
      TABLE_OF_CONTENTS[slug] = entry;
      category.entries.push({
        title,
        href,
      });
    }
  }
}

export const SLUGS = Object.keys(TABLE_OF_CONTENTS);
