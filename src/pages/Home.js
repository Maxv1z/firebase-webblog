import React, { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase-config";

function Home({ isAuth }) {
    const [postLists, setPostList] = useState([]);
    const postsCollectionRef = collection(db, "posts");



    const deletePost = async (id) => {
        const postDoc = doc(db, "posts", id);
        await deleteDoc(postDoc);
    };

    function getRelativeTime(createdAt) {
        const postTime = new Date(createdAt);
        console.log(postTime, "asdfasdfasdf")
        const currentTime = new Date();
        const timeDifference = currentTime - postTime;

        if (timeDifference < 60000) { // Less than a minute
            return "just now";
        } else if (timeDifference < 3600000) { // Less than an hour
            const minutes = Math.floor(timeDifference / 60000);
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (timeDifference < 86400000) { // Less than a day
            const hours = Math.floor(timeDifference / 3600000);
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (timeDifference < 604800000) { // Less than a week
            const days = Math.floor(timeDifference / 86400000);
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return postTime.toLocaleDateString(undefined, options);
        }
    }

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
                const createdAtDate = new Date(post.createdAt.seconds * 1000)
                return (
                    <div className="post" key={post.id}>
                        <div className="postHeader">
                            <div className="title">
                                <img src={post.author.avatar} alt="Profile" className='profile-picture' />
                                <h1>{post.title}</h1>
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
                        <div className="postTextContainer">{post.postText}</div>
                        <div className="time-and-author">
                            <h3>@{post.author.name}</h3>
                            <h3 className="time">{getRelativeTime(createdAtDate)}</h3>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home;
