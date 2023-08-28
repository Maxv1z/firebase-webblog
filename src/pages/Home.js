import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase-config";


function Home({ isAuth }) {
    const [postLists, setPostList] = useState([]);
    const postsCollectionRef = collection(db, "posts");

    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(postsCollectionRef, (snapshot) => {
            const updatedPosts = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setPostList(updatedPosts);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="homePage">
            {postLists.map((post) => {
                return (
                    <div className="post">
                        <div className="postHeader">
                            <div className="title">
                                <h1> {post.title}</h1>
                            </div>
                            <div className="deletePost">
                                {isAuth && post.author.id === auth.currentUser.uid && (
                                    <button className="deletePost"
                                        onClick={() => {
                                            deletePost(post.id);
                                        }}
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="postTextContainer"> {post.postText} </div>
                        <h3>@{post.author.name}</h3>
                    </div>
                );
            })}
        </div>
    );
}

export default Home;