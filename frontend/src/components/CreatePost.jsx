import React, { useState, useRef } from 'react';
import { Image, X, Send } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import toast from 'react-hot-toast';

const CreatePost = () => {
    const [textContent, setTextContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const {createPost, isCreatingPost} = usePostStore();

    // Handle image selection and create a local preview URL
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file)); 
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setPreviewUrl(null);
        fileInputRef.current.value = ""; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("in handle submit create post")
        // Logic: Post must contain either text or an image
        if (!textContent.trim() && !imageFile) {
            alert("Please add some text or an image!");
            return;
        }

        const formData = new FormData();
        formData.append("textContent", textContent);
        console.log("form data in create post is ", formData)

        if (imageFile) {
            // Must match upload.single("image") in routes
            formData.append("image", imageFile); 
        }
        console.log("before creating post")

        const isPostCreated = await createPost(formData);
        
        if (isPostCreated) {
            console.log("post created")
            // Reset form on success
            setTextContent("");
            removeImage();

            toast.success("Post created")
        }
        else {
            toast.error("Error creating post");
        }
    };

    const styles = {
        container: {
            maxWidth: '500px',
            margin: '20px auto',
            padding: '16px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #dbdbdb',
            fontFamily: 'sans-serif'
        },
        textarea: {
            width: '100%',
            border: 'none',
            outline: 'none',
            fontSize: '16px',
            resize: 'none',
            marginBottom: '10px',
            minHeight: '80px'
        },
        previewContainer: {
            position: 'relative',
            marginBottom: '10px'
        },
        previewImage: {
            width: '100%',
            borderRadius: '8px',
            display: 'block'
        },
        removeBtn: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #efefef',
            paddingTop: '12px'
        },
        postBtn: {
            backgroundColor: '#0095f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
        }
    };

    return (
        <div style={styles.container}>
            <div style={{padding: '0px 0px 10px 0px', fontSize: '25px', fontFamily: 'sans-serif'}}>
                Create Post
            </div>
            
            <form onSubmit={handleSubmit} >
                <textarea
                    placeholder="What's on your mind?"
                    style={styles.textarea}
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                />

                {previewUrl && (
                    <div style={styles.previewContainer}>
                        <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                        <button type="button" onClick={removeImage} style={styles.removeBtn}>
                            <X size={16} />
                        </button>
                    </div>
                )}

                <div style={styles.footer}>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555' }}
                    >
                        <Image size={24} />
                    </button>
                
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageChange}
                    />

                    <button type="submit" style={styles.postBtn} disabled={isCreatingPost}>
                        {isCreatingPost ? "Posting..." : "Post"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;