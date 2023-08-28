// CreatePost.js

import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ isAuth }) => {
    const [title, setTitle] = useState('');
    const [postText, setPostText] = useState('');

    const postsCollectionRef = collection(db, 'posts');

    let navigate = useNavigate();

    const CreatePost = async () => {
        const currentUser = auth.currentUser;

        function getRelativeTime(timestamp) {
            const currentTime = new Date();
            const postTime = new Date(timestamp);
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

        await addDoc(postsCollectionRef, {
            title,
            postText,
            author: {
                name: currentUser.displayName,
                id: currentUser.uid,
                avatar: currentUser.photoURL, // Store the avatar image URL
            },
            createdAt: getRelativeTime(new Date().toISOString()),
        });
        navigate('/');
    };

    useEffect(() => {
        if (!isAuth) {
            navigate('/');
        }
    }, []);

    return (
        <div className='createPostPage'>
            <div className='cpContainer'>
                <h1>Create a post</h1>
                <div className='inputGp'>
                    <label>Title:</label>
                    <input placeholder='Title...' onChange={(event) => setTitle(event.target.value)} />
                </div>
                <div className='inputGp'>
                    <label>Post:</label>
                    <textarea placeholder='Post...' onChange={(event) => setPostText(event.target.value)}></textarea>
                </div>
                <button onClick={CreatePost}>Submit Post</button>
            </div>
        </div>
    );
};

export default CreatePost;
