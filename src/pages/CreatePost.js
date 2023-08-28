import React, { useState, useEffect } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

const CreatePost = ({ isAuth }) => {
    const [title, setTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [creationDate, setCreationDate] = useState('');

    const postsCollectionRef = collection(db, 'posts');

    let navigate = useNavigate();

    const CreatePost = async () => {
        const currentUser = auth.currentUser;
        const currentTime = new Date();

        await addDoc(postsCollectionRef, {
            title,
            postText,
            author: {
                name: currentUser.displayName,
                id: currentUser.uid,
                avatar: currentUser.photoURL,
            },
            createdAt: currentTime,
        });

        setCreationDate(currentTime);

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
