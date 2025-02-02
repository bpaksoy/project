import React, { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../shared';
import usePosts from '../hooks/FetchPosts';

function AddReplyModal({ commentId, onAddReply }) {
    // console.log("COMMENTId", commentId);
    const { updatePosts } = usePosts();
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    const handleOpenModal = () => {
        setIsOpen(true);
        console.log("handleOpenModal", isOpen);
        setError(null)
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setContent('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('access');

        try {
            const response = await axios.post(`${baseUrl}api/comments/${commentId}/replies/create/`, {
                content,
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log('Reply created successfully:', response.data);
            setContent('');
            onAddReply(Date.now()); // Update the state to re-render the component
            await updatePosts();

        } catch (err) {
            setError(err.response.data.detail || 'Error creating post');
            console.log("err", err)
        }
        console.log('Submitting comment:', { content });
        handleCloseModal();
    };

    return (
        <div>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-2" role="alert">
                    <strong className="font-bold">Ops! </strong>
                    <span className="block sm:inline">Something went wrong! </span>
                </div>
            )}
            <div className='flex justify-end'>
                <button onClick={handleOpenModal} className="hover:bg-gray-300 text-black font-regular p-2 rounded underline decoration-solid">
                    Reply
                </button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" />

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true" />

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                        {/* Icon or image here */}
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                                            Add New Reply
                                        </h3>
                                        <div className="mt-2">
                                            <form onSubmit={handleSubmit}>
                                                <div className="mb-4">
                                                    {/* <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                                                        Content
                                                    </label> */}
                                                    <textarea
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                        id="content"
                                                        value={content}
                                                        onChange={(e) => setContent(e.target.value)}
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    <button type="submit" className="bg-primary hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
                                                        Save
                                                    </button>
                                                    <button type="button" onClick={handleCloseModal} className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AddReplyModal;
