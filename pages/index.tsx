import Head from "next/head";
import Link from "next/link";
import { compareDesc, format, parseISO } from "date-fns";
import { allPosts, Post } from "contentlayer/generated";

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
  posts: PostMetadata[];
};

const Page = ({ posts }: PageProps) => {
  return (
    <div className="mx-auto max-w-2xl py-16 text-center">
      <Head>
        <title>nyfi blog</title>
      </Head>

      <h1 className="mb-8 text-3xl font-bold">nyfi blog</h1>

      {posts.map((post) => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
};

export default Page;

export async function getStaticProps() {
  const posts: PostMetadata[] = allPosts
    .map((post) => ({
      _id: post._id,
      title: post.title,
      date: post.date,
      url: post.url,
    }))
    .sort((a, b) => {
      return compareDesc(new Date(a.date), new Date(b.date));
    });
  return { props: { posts } };
}
