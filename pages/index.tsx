import Loader from "@/components/Loader";
import toast from "react-hot-toast";

import { useEffect, useState } from "react";
import { GetServerSidePropsContext } from "next";
import { firestore, fromMillis, postToJSON } from "@/libs/firebase";
import {
  collectionGroup,
  query,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import PostFeed from "@/components/PostFeed";

// Max post to query per page
const LIMIT = 1;

interface Props {
  posts: DocumentData[];
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const postsQuery = query(
    collectionGroup(firestore, "posts"),
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );
  let posts: DocumentData[] = [];

  try {
    const querySnapshot = await getDocs(postsQuery);
    posts = querySnapshot.docs.map((doc) => postToJSON(doc));
  } catch (err) {
    console.log(err);
    toast.error("Could not fetch posts.");
  }

  return {
    props: { posts }, // will be passed to the page component as props
  };
}

export default function Home(props: Props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  useEffect(() => {
    console.log("posts", posts);
  });

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];

    // timestamp of last fetched post
    const cursor =
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt;

    console.log(cursor);

    const postsQuery = query(
      collectionGroup(firestore, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    let newPosts: DocumentData[] = [];
    try {
      const querySnapshot = await getDocs(postsQuery);
      newPosts = querySnapshot.docs.map((doc) => doc.data());
      console.log("newpost", newPosts);
    } catch (err) {
      console.log(err);
      toast.error("Could not fetch posts.");
    }

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}

      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
