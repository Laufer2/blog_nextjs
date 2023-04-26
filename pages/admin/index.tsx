import styles from "../../styles/Admin.module.css";
import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../libs/context";
import { firestore, auth } from "../../libs/firebase";

import { FormEvent, useContext, useState } from "react";
import { useRouter } from "next/router";

import kebabCase from "lodash/kebabcase";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  orderBy,
  serverTimestamp,
  setDoc,
  query,
  getDocs,
} from "firebase/firestore";

export default function AdminPostsPage(props: any) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

async function getPostList() {
  const auth = getAuth();
  const uid = auth.currentUser!.uid;
  const postsRef = collection(
    doc(collection(firestore, "users"), uid),
    "posts"
  );
  const orderedPostsQuery = query(postsRef, orderBy("createdAt"));
  const querySnapshot = await getDocs(orderedPostsQuery);
  const posts = querySnapshot.docs.map((doc) => doc.data());
  return posts;
}

function PostList() {
  let posts;
  getPostList()
    .then((orderedPosts) => {
      posts = orderedPosts;
    })
    .catch((error) => {
      toast.error(error.message);
    });
  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    const uid = auth.currentUser!.uid;
    const userRef = doc(collection(firestore, "users"), uid);
    const postRef = doc(collection(userRef, "posts"), slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(postRef, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
