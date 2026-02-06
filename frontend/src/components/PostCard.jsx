import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { usePostStore } from '../store/usePostStore';

const PostCard = ({ post, currentUser }) => {
    const [showComments, setShowComments] = useState(false);
    const {addComment, toggleLike} = usePostStore();
    const {register, handleSubmit} = useForm();

    const likes = post.likes || [];
    const comments = post.comments || [];
    const isLiked = likes.includes(currentUser.username);

    const handleToggleLike = async () => {
        await toggleLike(post.postId)
    };

    const handleAddComment = async (comment) => {
        await addComment(post.postId, comment);
    };

    const styles = {
        card: {
            maxWidth: '500px',
            margin: '20px auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #dbdbdb',
            fontFamily: 'sans-serif',
            overflow: 'hidden'
        },
        header: {
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            fontWeight: '600'
        },
        image: {
            width: '100%',
            display: 'block'
        },
        actionArea: {
            padding: '12px 16px',
            display: 'flex',
            gap: '20px'
        },
        iconBtn: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#262626'
        }
    };

    return (
        <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <div style={{width: 32, height: 32, borderRadius: '50%', backgroundColor: '#0095f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>
                    {post.username[0].toUpperCase()}
                </div>
                <span style={{marginLeft: '10px'}}>
                    {post.username}
                </span>
            </div>

            {/* Text Content */}
            {post.textContent && (
                <div style={{padding: '0 16px 12px', fontSize: '14px', color: '#262626'}}>
                    {post.textContent}
                </div>
            )}

            {/* Image Content */}
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post content" style={styles.image} />
            )}

            {/* Actions */}
            <div style={styles.actionArea}>
                <button onClick={handleToggleLike} style={{...styles.iconBtn, color: isLiked ? '#ed4956' : '#262626'}}>
                    <Heart size={24} fill={isLiked ? "#ed4956" : "none"} />
                    <span>
                        {likes.length}
                    </span>
                </button>
                <button onClick={() => setShowComments(!showComments)} style={styles.iconBtn}>
                    <MessageCircle size={24} />
                    <span>
                        {comments.length}
                    </span>
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div style={{padding: '12px 16px', borderTop: '1px solid #efefef', backgroundColor: '#fafafa'}}>
                    {comments.map((c, i) => (
                        <div key={i} style={{fontSize: '13px', marginBottom: '8px'}}>
                            <strong>{c.username}</strong> {c.text}
                        </div>
                    ))}
                    <form onSubmit={handleSubmit(handleAddComment)} style={{display: 'flex', marginTop: '10px'}}>
                        <input 
                            style={{flex: 1, border: '1px solid #dbdbdb', borderRadius: '4px', padding: '6px 12px', fontSize: '13px'}}
                            {...register("comment")}
                            
                            placeholder="Add a comment..."
                        />
                        <button type="submit" style={{background: 'none', border: 'none', color: '#0095f6', fontWeight: '600', marginLeft: '8px', cursor: 'pointer'}}>
                            Post
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;