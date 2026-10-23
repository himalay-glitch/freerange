import type { PostCard } from "@/types/content";

const PODCAST_TAGS = ["The Free Ranger Podcast", "Podcast"];

/**
 * Placeholder episodes for the homepage "The Free Ranger Podcast" row (design clone: generic
 * titles and placeholder artwork only). One row of three cards, the third one wide.
 */
export const PODCAST_ROWS: PostCard[][] = [
  [
    {
      slug: "sample-episode-1",
      href: "/blog/sample-episode-1",
      title: "The Free Ranger Podcast—Season 1, Episode 1: Why Stories Change Minds",
      image: "/placeholders/card-8.svg",
      tags: PODCAST_TAGS,
    },
    {
      slug: "sample-episode-2",
      href: "/blog/sample-episode-2",
      title: "The Free Ranger Podcast—Season 1, Episode 2: Designing for Good",
      image: "/placeholders/card-6.svg",
      tags: PODCAST_TAGS,
    },
    {
      slug: "sample-episode-3",
      href: "/blog/sample-episode-3",
      title: "The Free Ranger Podcast—Season 1, Episode 3: Building Products With Purpose",
      image: "/placeholders/card-2.svg",
      tags: PODCAST_TAGS,
      wide: true,
    },
  ],
];
