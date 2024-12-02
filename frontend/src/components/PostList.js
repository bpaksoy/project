import React, { useState, useEffect } from 'react';
import { images } from "../constants";
import CommentModal from '../utils/CommentModal';
import Comment from './Comment';
import EditDeleteModal from '../utils/EditDeleteModal';
import LikeButton from '../utils/LikeButton';
import timeSince from '../utils/TimeStamp';
import { useCurrentUser } from '../UserProvider/UserProvider';
import { baseUrl } from '../shared';
import axios from 'axios';
import EditPostModal from '../utils/EditPostModal';

const PostList = ({ posts, onAddPost }) => {
    const { user, fetchUser } = useCurrentUser();

    useEffect(() => {
        fetchUser();
    }, [])

    const [postLikes, setPostLikes] = useState({}); // State to track likes for each post

    const updateLikeStatus = (postId, isLiked) => {
        setPostLikes((prevPostLikes) => ({ ...prevPostLikes, [postId]: isLiked }));
        onAddPost(); // Update the post list when a like status changes
    };

    const [modalIsOpen, setModalIsOpen] = useState(null);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [postIdToEdit, setPostIdToEdit] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null);

    const handleOpenModal = (postId) => {
        setModalIsOpen(postId);
    };

    const handleEditPost = async (postId) => {
        try {
            const response = await axios.get(`${baseUrl}api/posts/${postId}/`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
            });
            setPostIdToEdit(postId);
            setPostToEdit(response.data);
            console.log('Post to edit:', response.data);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const handleCloseModal = () => {
        setModalIsOpen(false);
        setPostToEdit(null);
    };


    const handleDeletePost = (postId) => {
        setPostIdToDelete(postId);
        handleCloseModal();
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`${baseUrl}api/posts/${postIdToDelete}/delete`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access')}`,
                },
            });
            onAddPost(); // Update the post list when a post is deleted
            alert("Post deleted successfully!");
        } catch (error) {
            console.error('Error deleting post:', error);
        } finally {
            setPostIdToDelete(null);
        }
    };

    const [lastUpdatedComment, setLastUpdatedComment] = useState(null);

    const updateComments = (time) => {
        setLastUpdatedComment(time);
        onAddPost(); // Update the post list when a comment is added
    };

    return (
        <div className="container p-4">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Trending</h1>
            <div className="bg-gray-200 min-h-screen flex flex-col items-center rounded-lg">
                {posts?.map((post) => (
                    <div key={post.id} className="bg-white p-8 rounded-lg shadow-md max-w-xl mb-2 mt-3 relative">

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <img src={post.author.image ? `${baseUrl}${post.author.image}` : images.profile} alt="User Avatar" className="w-8 h-8 rounded-full" />
                                <div>
                                    <p className="text-gray-800 font-semibold">{post.author.username}</p>
                                    <p className="text-gray-500 text-sm">{timeSince(post.created_at)}</p>
                                </div>
                            </div>
                            <div className="text-gray-500 cursor-pointer">

                                {post.author.id === user?.id && (
                                    <button onClick={() => handleOpenModal(post.id)} className="hover:bg-gray-50 rounded-full p-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="12" cy="7" r="1" />
                                            <circle cx="12" cy="12" r="1" />
                                            <circle cx="12" cy="17" r="1" />
                                        </svg>
                                    </button>
                                )}
                                <EditDeleteModal isOpen={modalIsOpen === post.id} onClose={handleCloseModal} onEdit={() => handleEditPost(post.id)} onDelete={() => handleDeletePost(post.id)} itemId={post.id} itemType="post" handleConfirmDelete={handleConfirmDelete} contentIdToDelete={postIdToDelete} handleCloseModal={handleCloseModal} />
                                {postIdToEdit &&
                                    <EditPostModal post={postToEdit} isOpen={modalIsOpen} onClose={handleCloseModal} onAddPost={onAddPost} /> 
                                }
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-gray-800 text-lg font-semibold">{post.title}<a href="" className="text-blue-600">#LaunchPost</a>
                                <a href="" className="text-blue-600">#Launch</a>
                            </p>
                            <p className="text-gray-800">{post.content}</p>
                        </div>

                        <div className="mb-4">
                            <img src={images.thumbnail} alt="Post Image" className="w-full h-48 object-cover rounded-md" />
                        </div>

                        <div className="flex items-center justify-between text-gray-500">
                            <div className="flex items-center space-x-2">
                                <button className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
                                    <svg className={`w-5 h-5 fill-current ${postLikes[post.id] ? 'fill-pink-500' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C6.11 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-4.11 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span>{post.likes_count} Like</span>
                                </button>
                                <LikeButton contentType="post" objectId={post.id} onLikeStatusChange={updateLikeStatus} />
                            </div>
                            <button className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1">
                                <svg width="22px" height="22px" viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22ZM8 13.25C7.58579 13.25 7.25 13.5858 7.25 14C7.25 14.4142 7.58579 14.75 8 14.75H13.5C13.9142 14.75 14.25 14.4142 14.25 14C14.25 13.5858 13.9142 13.25 13.5 13.25H8ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5Z"></path>
                                    </g>
                                </svg>
                                <span>{post.comment_count + post.reply_count} Comment</span>
                            </button>
                        </div>
                        <hr className="mt-2 mb-2" />
                        <div className="flex flex-row items-center">
                            <p className="text-gray-800 font-semibold px-1">Comment</p>
                            <CommentModal postId={post.id} onAddComment={updateComments} />
                        </div>
                        <Comment postId={post.id} lastUpdatedComment={lastUpdatedComment} onAddPost={onAddPost} />
                    </div>
                ))}
            </div>
        </div>);
}

export default PostList;