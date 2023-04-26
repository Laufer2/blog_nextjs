import styles from "../../styles/Post.module.css";
import PostContent from "../../components/PostContent";
import {
  firestore,
  getUserWithUsername,
  postToJSON,
} from "../../libs/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  DocumentData,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

interface UrlParams {
  username: string;
  slug: string;
}

// fetch data on server at build time in order to prerender page in advance
export async function getStaticProps({ params }: any) {
  const { username, slug } = params as UrlParams;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(collection(userDoc.ref, "posts"), slug);
    const postSnapshot = await getDoc(postRef);
    if (!postSnapshot.exists()) {
      return {
        notFound: true,
      };
    }
    post = postToJSON(postSnapshot);

    //for refetching on client side for hydration with realtime data
    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 5000, // miliseconds
  };
}
//which actuall pages to render
export async function getStaticPaths() {
  const snapshot = await getDocs(collectionGroup(firestore, "posts"));

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  };
}

export default function Post(props: any) {
  const postRef = doc(firestore, props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>
      <section>
        <PostContent post={post} />
      </section>

      <aside className="card">
        <p>
          <strong>{post.heartCount || 0} 🤍</strong>
        </p>
      </aside>
    </main>
  );
}
