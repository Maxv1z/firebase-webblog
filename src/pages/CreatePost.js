import React, { useState, useEffect } from 'react';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { db, auth, storage } from '../firebase-config';
import { useNavigate } from 'react-router-dom';

import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage'

const CreatePost = ({ isAuth }) => {
    const [title, setTitle] = useState('');
    const [postText, setPostText] = useState('');
    const [creationDate, setCreationDate] = useState('');
    const [imageUpload, setImageUpload] = useState(null);

    const postsCollectionRef = collection(db, 'posts');

    let navigate = useNavigate();

    const CreatePost = async () => {
        const currentUser = auth.currentUser;
        // time post creation
        const currentTime = new Date();

        let imageUrl = null;

        navigate('/');

        // Create a new post in Firestore
        const newPostRef = await addDoc(postsCollectionRef, {
            title,
            postText,
            author: {
                name: currentUser.displayName,
                id: currentUser.uid,
                avatar: currentUser.photoURL,
            },
            createdAt: currentTime,
            image: imageUrl
        });
        // if the input field is not "null" we will push it to db
        if (imageUpload) {
            const imageRef = ref(storage, `images/${imageUpload.name + auth.currentUser.uid}`);
            await uploadBytes(imageRef, imageUpload);
            // Get the download URL of the uploaded image
            imageUrl = await getDownloadURL(imageRef);
            // Update the post with the image URL
            await updateDoc(newPostRef, {
                image: imageUrl,
            });
        }
        setCreationDate(currentTime);
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
                <input type="file" onChange={(event) => { setImageUpload(event.target.files[0]) }} />
                <button onClick={CreatePost}>Submit Post</button>
            </div>
        </div>
    );
};

export default CreatePost;
