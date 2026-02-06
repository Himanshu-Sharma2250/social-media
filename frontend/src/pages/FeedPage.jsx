import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { usePostStore } from '../store/usePostStore';

const FeedPage = ({ currentUser }) => {
    const {posts, getAllPosts, isGettingPosts} = usePostStore();
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    // Fetch all posts when the component mounts
    useEffect(() => {
        const fetchPosts = async () => {
            const res = await getAllPosts();

            if (!res) {
                setError("Failed to load feed. Please try again later.");
            }
        };

        fetchPosts();
    }, [getAllPosts]);

    // useMemo helps perform sorting efficiently only when posts or activeTab change
    const filteredPosts = useMemo(() => {
        let sortedPosts = [...posts]; // Clone the array to avoid mutating store data
        
        if (activeTab === 'liked') {
            return sortedPosts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
        }
        
        if (activeTab === 'commented') {
            return sortedPosts.sort((a, b) => (b.comments?.length || 0) - (a.comments?.length || 0));
        }

        return sortedPosts; // Default: 'all' (usually sorted by date from backend)
    }, [posts, activeTab]);

    const styles = {
        feedContainer: { backgroundColor: '#fafafa', minHeight: '100vh', padding: '20px 10px', fontFamily: 'sans-serif' },
        tabContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' },
        tabButton: (isActive) => ({
            padding: '10px 20px',
            borderRadius: '20px',
            border: '1px solid #dbdbdb',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.2s',
            backgroundColor: isActive ? '#0095f6' : '#fff',
            color: isActive ? '#fff' : '#262626'
        }),
        loadingText: { textAlign: 'center', marginTop: '50px', color: '#8e8e8e', fontSize: '18px' },
        errorText: { textAlign: 'center', color: '#ed4956', marginTop: '20px' }
    };

    return (
        <div style={styles.feedContainer}>
            {/* 1. Create Post Form at the top */}
            <CreatePost />

            {/* TABS INTERFACE */}
            <div style={styles.tabContainer}>
                <button 
                    style={styles.tabButton(activeTab === 'all')} 
                    onClick={() => setActiveTab('all')}
                >
                    All Posts
                </button>
                <button 
                    style={styles.tabButton(activeTab === 'liked')} 
                    onClick={() => setActiveTab('liked')}
                >
                    Most Liked
                </button>
                <button 
                    style={styles.tabButton(activeTab === 'commented')} 
                    onClick={() => setActiveTab('commented')}
                >
                    Most Commented
                </button>
            </div>

            {/* 2. Loading State (Assignment Requirement) */}
            {isGettingPosts && <div style={styles.loadingText}>Loading your feed...</div>}

            {/* 3. Error Handling */}
            {error && <div style={styles.errorText}>{error}</div>}

            {/* 4. The Posts List */}
            {!isGettingPosts && filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                    <PostCard
                        key={post.postId} // Using correct ID based on backend response
                        post={post} 
                        currentUser={currentUser} 
                    />
                ))
            ) : (
                !isGettingPosts && <div style={styles.loadingText}>No posts to show here.</div>
            )}
        </div>
    );
};

export default FeedPage;