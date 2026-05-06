import type { CollectionEntry } from "astro:content";
import postFilter from "./postFilter";

/** Strip `zh` suffix from post id to get the base slug.
 *  Astro glob loader strips dots from filenames, so "foo.zh.md" becomes id "foozh". */
export function getBaseSlug(id: string, post?: CollectionEntry<"blog">): string {
  const parts = id.split("/");
  const last = parts[parts.length - 1];
  // Only strip zh suffix if the post is actually Chinese
  const isZh = post ? getPostLang(post) === "zh" : last.endsWith("zh");
  if (isZh) {
    parts[parts.length - 1] = last.replace(/zh$/, "");
  }
  return parts.join("/");
}

/** Get the language of a post from its frontmatter (defaults to "en") */
export function getPostLang(
  post: CollectionEntry<"blog">
): "en" | "zh" {
  return (post.data as any).lang === "zh" ? "zh" : "en";
}

/** Filter posts to a specific language */
export function getPostsForLang(
  posts: CollectionEntry<"blog">[],
  lang: "en" | "zh"
): CollectionEntry<"blog">[] {
  return posts.filter(post => getPostLang(post) === lang);
}

/** Build a map from base slug to { en, zh } post pairs */
export function buildTranslationMap(
  posts: CollectionEntry<"blog">[]
): Map<string, { en?: CollectionEntry<"blog">; zh?: CollectionEntry<"blog"> }> {
  const map = new Map<
    string,
    { en?: CollectionEntry<"blog">; zh?: CollectionEntry<"blog"> }
  >();

  for (const post of posts.filter(postFilter)) {
    const lang = getPostLang(post);
    const base = getBaseSlug(post.id, post);
    if (!map.has(base)) {
      map.set(base, {});
    }
    map.get(base)![lang] = post;
  }

  return map;
}
