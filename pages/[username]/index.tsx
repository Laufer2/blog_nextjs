import { getUserWithUsername, postToJSON } from "../../libs/firebase";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";
import {
  collection,
  query as firestoreQuery,
  where,
  orderBy,
  limit,
  QuerySnapshot,
  DocumentSnapshot,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import { toast } from "react-hot-toast";

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<{ props: UserData }> {
  // username from URL
  const { username } = query;

  // get user document based on username in URL
  const userDoc: DocumentSnapshot<DocumentData> | undefined | null =
    await getUserWithUsername(username! as string);

  let user: DocumentData | undefined | null = null;
  let posts: DocumentData[] | null = null;

  //no user = render 404 page
  if (!userDoc?.exists()) {
    return {
      notFound: true,
    };
  }

  // if user exists, return user posts
  if (userDoc) {
    user = userDoc.data();
    const postsQuery = firestoreQuery(
      collection(userDoc.ref, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    try {
      const postsSnapshot: QuerySnapshot<DocumentData> = await getDocs(
        postsQuery
      );
      posts = postsSnapshot.docs.map(postToJSON);
    } catch (err) {
      console.log(err);
      toast.error("Could not fetch posts.");
    }
  }

  return {
    props: { user, posts }, //will be passed to the page component as props
  };
}

interface UserData {
  user: DocumentData | null | undefined;
  posts: DocumentData[] | null | undefined;
}

export default function UserProfilePage({ user, posts }: UserData | any) {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
