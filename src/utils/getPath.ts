import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @param lang - language of the post ("en" or "zh")
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true,
  lang?: "en" | "zh"
) {
  const pathSegments = filePath
    ?.replace(BLOG_PATH, "")
    .split("/")
    .filter(path => path !== "") // remove empty string in the segments ["", "other-path"] <- empty string will be removed
    .filter(path => !path.startsWith("_")) // exclude directories start with underscore "_"
    .slice(0, -1) // remove the last segment_ file name_ since it's unnecessary
    .map(segment => slugifyStr(segment)); // slugify each segment path

  const basePath = includeBase ? "/posts" : "";

  // Making sure `id` does not contain the directory
  const blogId = id.split("/");
  let slug = blogId.length > 0 ? blogId.slice(-1)[0] : blogId[0];

  // Strip zh suffix from slug for clean URLs
  // Astro glob loader strips dots from filenames, so "foo.zh.md" becomes id "foozh"
  if (lang === "zh") {
    slug = slug.replace(/zh$/, "");
  }

  // Add zh prefix for Chinese posts
  const langPrefix = lang === "zh" ? "zh" : "";

  // If not inside the sub-dir, simply return the file path
  if (!pathSegments || pathSegments.length < 1) {
    return langPrefix
      ? [basePath, langPrefix, slug].join("/")
      : [basePath, slug].join("/");
  }

  return langPrefix
    ? [basePath, langPrefix, ...pathSegments, slug].join("/")
    : [basePath, ...pathSegments, slug].join("/");
}
