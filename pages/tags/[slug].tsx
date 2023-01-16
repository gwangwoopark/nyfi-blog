import Head from "next/head";
import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";
import { GetStaticPropsContext } from "next";
import slugify from "slugify";

type PostMetadata = {
  _id: string;
  title: string;
  date: string;
  url: string;
};

const PostCard = (post: PostMetadata) => {
  return (
    <div className="mb-6">
      <time dateTime={post.date} className="block text-sm text-slate-600">
        {format(parseISO(post.date), "LLLL d, yyyy")}
      </time>
      <h2 className="text-lg">
        <Link href={post.url}>
          <div className="text-blue-700 hover:text-blue-900">{post.title}</div>
        </Link>
      </h2>
    </div>
  );
};

type PageProps = {
  tag: string | undefined;
  postMetadataList: PostMetadata[];
};

const Page = ({ tag, postMetadataList }: PageProps) => {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <Head>
        <title>{tag}</title>
      </Head>

      <h1 className="mb-8 text-3xl font-bold">{tag}</h1>

      {postMetadataList.map((post) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
};

export default Page;

export const getStaticPaths = async () => {
  const setTags = new Set<string>();
  allPosts.forEach((post) =>
    post.tags.forEach((tag) => setTags.add(String(tag)))
  );
  const paths = Array.from(setTags.values()).map(
    (tag) => `/tags/${slugify(String(tag))}`
  );

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }: GetStaticPropsContext) => {
  const slug = params?.slug;
  if (typeof slug === "string") {
    const posts = allPosts.filter((post) =>
      post.tags.map((tag) => slugify(String(tag))).includes(slug)
    );
    if (posts.length > 0) {
      const postMetadataList = posts
        .map((post) => ({
          _id: post._id,
          title: post.title,
          date: post.date,
          url: post.url,
        }))
        .sort((a, b) => {
          return compareDesc(new Date(a.date), new Date(b.date));
        });
      const tag = posts[0].tags.find(
        (tag) => slugify(String(tag)) === params?.slug
      );
      return {
        props: {
          tag,
          postMetadataList,
        },
      };
    }
  }
  return {
    props: {
      tag: undefined,
      postMetadataList: [],
    },
  };
};
