import Head from "next/head";
import Link from "next/link";
import { allPosts } from "contentlayer/generated";
import slugify from "slugify";

type TagCard = {
  tag: string;
};

const TagCard = ({ tag }: TagCard) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg">
        <Link href={`/tags/${slugify(tag)}`}>
          <div className="text-blue-700 hover:text-blue-900">{tag}</div>
        </Link>
      </h2>
    </div>
  );
};

type PageProps = {
  tags: string[];
};

const Page = ({ tags }: PageProps) => {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <Head>
        <title>All tags</title>
      </Head>

      <h1 className="mb-8 text-3xl font-bold">All tags</h1>

      {tags.map((tag) => (
        <TagCard key={tag} tag={tag} />
      ))}
    </div>
  );
};

export default Page;

export async function getStaticProps() {
  const setTags = new Set<string>();
  allPosts.forEach((post) =>
    post.tags.forEach((tag) => setTags.add(String(tag)))
  );
  const tags = Array.from(setTags.values()).sort();
  return { props: { tags } };
}
