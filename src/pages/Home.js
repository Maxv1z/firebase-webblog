import React, { useState, useEffect } from "react";
import { getDocs, collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { auth, db, storage } from "../firebase-config";
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage'


function Home({ isAuth }) {
    const [postLists, setPostList] = useState([]);
    const postsCollectionRef = collection(db, "posts");
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);



    const deletePost = async (id) => {
        if (deleteConfirmation) {
            const postDoc = doc(db, "posts", id);
            await deleteDoc(postDoc);
        }
        setDeleteConfirmation(false);
    };

    function getRelativeTime(createdAt) {
        const postTime = new Date(createdAt);
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

    const [imageList, setImageList] = useState([])

    const imageListRef = ref(storage, "images/")

    useEffect(() => {
        const unsubscribe = onSnapshot(postsCollectionRef, async (snapshot) => {
            const updatedPosts = [];

            for (const doc of snapshot.docs) {
                const post = doc.data();
                post.id = doc.id;

                if (post.imageURL) {
                    try {
                        // Fetch the image URL using the imageURL path
                        const imageRef = ref(storage, post.imageURL);
                        const imageURL = await getDownloadURL(imageRef);
                        post.imageURL = imageURL;
                    } catch (error) {
                        console.error("Error fetching image URL:", error);
                    }
                }

                updatedPosts.push(post);
            }

            setPostList(updatedPosts);
        });

        return () => unsubscribe();
    }, []);


    return (
        <div className="homePage">
            {postLists.map((post) => {
                const createdAtDate = new Date(post.createdAt.seconds * 1000)
                return (
                    <div className={`post ${post.id}`} key={post.id}>
                        <div className="postHeader">
                            <div className="title">
                                <img src={post.author.avatar} alt="Profile" className='profile-picture' />
                                <h1>{post.title}</h1>
                                {post.image && <img src={post.image} alt='Post' className="post-img" />}
                            </div>
                            <div className="deletePost">
                                {isAuth && post.author.id === auth.currentUser.uid && (
                                    <>
                                        <button className="deletePost"
                                            onClick={() => {
                                                setDeleteConfirmation(true);
                                            }}
                                        >
                                            x
                                        </button>
                                        {deleteConfirmation && (
                                            <div className="confirmationPopup">
                                                <p>Delete this post?</p>
                                                <button onClick={() => deletePost(post.id)}>Confirm</button>
                                                <button onClick={() => setDeleteConfirmation(false)}>Cancel</button>
                                            </div>
                                        )}
                                    </>
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
