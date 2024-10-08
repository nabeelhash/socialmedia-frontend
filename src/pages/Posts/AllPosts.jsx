import { React, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import { useContext } from 'react'
import { AuthContext } from '../../context/Auth'
import Rightbar from '../../components/Rightbar'

const AllBlogs = () => {
    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState();
    const {auth,setAuth} = useContext(AuthContext)
    const [commentId,setCommentId] = useState('')

    const navigate = useNavigate()

    useEffect(function(){
        if(!auth){
            navigate('/')
            toast.error('Login First')
        }
    },[])

    useEffect(function () {
        const fetchData = async function () {
            try {
                const response = await fetch('http://localhost:4000/allPosts', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.log('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                toast.success('All Blogs Here')
                setPosts(result)
            }
            catch (error) {
                toast.error(`Login failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handle = async function (id) {
        const askUser = window.prompt('Are you sure you want to delete this post')
        if (!askUser) {
            return
        }
        try {
            let response = await fetch(`http://localhost:4000/deletePost/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('You are not Author of this post');
            }
            const result = await response.json()
            console.log(result)
            toast.success('Post Deleted successfully');
            const filter = posts.filter(post => post._id !== id)
            setPosts(filter)
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const handleLike = async function (id) {
        try {
            let response = await fetch(`http://localhost:4000/like/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('Something went wrong');
            }
            const result = await response.json()
            console.log(result)
            setPosts(posts.map(post => post._id === id ? { ...post, noOfLikes: post.noOfLikes + 1 } : post))
            toast.success('Post Liked successfully');

        }
        catch (error) {
            console.log(error.message)
        }
    }

    const handleDislike = async function (id) {
        try {
            let response = await fetch(`http://localhost:4000/dislike/${id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('Something went wrong');
            }
            const result = await response.json()
            console.log(result)
            toast.success('Post Disliked successfully');
            setPosts(posts.map(post => post._id === id ? { ...post, noOfLikes: post.noOfLikes - 1 } : post))
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const handleComment = async function (id) {
        try {
            let response = await fetch(`http://localhost:4000/comment/${id}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('Something went wrong');
            }
            const result = await response.json()
            console.log(result)
            toast.success('Post Disliked successfully');
            window.location.reload();
        }
        catch (error) {
            console.log(error.message)
        }
    }

    const handleEdit = function(post){
        if(post.author._id === auth.user._id){
            navigate(`/updatePost/${post._id}`)
        }
        else{
            toast.error('You cannot edit since you are not admin')
        }
    }
    return (
        <div className='bg-gray-300 h-full'>
            <Navbar></Navbar>
            <div className='h-full flex w-[100%]'>
                <Sidebar />
                <div className='flex flex-wrap items-center justify-center w-full md:w-[60%] lg:w-full'>
                    {posts.map(post => (
                        <div key={post._id} className='flex flex-col w-[90%] md:w-[90%] lg:w-[90%] justify-start items-center rounded  px-4 my-4 py-4 bg-white'>
                            <div className='flex justify-between items-center gap-3 w-full'>
                                <div className='flex justify-center items-center gap-3'>
                                    <p className='w-[10%%] mb-3'>{post.author ? <img className='rounded-[30px] w-[50px] h-[50px]' src={`http://localhost:4000/${post.author.profileImage}`}></img> : 'Author not found'}</p>
                                    <p className='text-xl text-center font-semibold mb-3'>{post.author ? post.author.name : 'Author not found'}</p>
                                </div>
                                <div className='text-2xl'>
                                    <div class="dropdown">
                                        <button data-bs-toggle="dropdown" aria-expanded="false">
                                            <i class="fa-solid fa-ellipsis"></i>
                                        </button>
                                        <ul class="dropdown-menu px-3 py-1">
                                            {post.author._id === auth.user._id ?<li className='text-black cursor-pointer' onClick={function () { handle(post._id) }}>Delete Blog</li> : ''}
                                            {post.author._id === auth.user._id ?<li className='text-black cursor-pointer' onClick={()=>handleEdit(post)}>Edit</li>: ''}
                                            <Link to={`/singlePost/${post._id}`}><li className='text-black'>View</li></Link>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <p className='text-lg w-full text-left font-medium mb-3'>{post.description}</p>
                            <div className='text-left'>
                                {post.postImage ? (<img className='mb-3 w-[100%]' src={`http://localhost:4000/${post.postImage}`}></img>) : ('')}
                            </div>

                            <div className='flex w-full justify-between items-center gap-2'>
                                <div className='flex justify-center items-center gap-3'>
                                    <div className='bg-black text-white px-2 py-1 rounded'>
                                        <p className=''>{post.noOfLikes}</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <i class="fa-solid fa-thumbs-up text-2xl text-black" onClick={function () { handleLike(post._id) }}></i>
                                        <p className='hidden md:block cursor-pointer'>Like</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <i class="fa-solid fa-thumbs-down text-2xl text-black" onClick={function () { handleDislike(post._id) }}></i>
                                        <p className='hidden md:block cursor-pointer'>Dislike</p>
                                    </div>
                                </div>

                                <div className='flex items-center gap-2' data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    <i class="fa-regular fa-comment-dots text-black text-2xl" ></i>
                                    <p className='hidden md:block cursor-pointer' onClick={function(){setCommentId(post._id)}}>Comments</p>
                                </div>
                            </div>


                            {/* <!-- Modal --> */}
                            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div class="modal-dialog">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h1 class="modal-title fs-5" id="exampleModalLabel" className='font-semibold text-xl'>Write Comment</h1>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            <input type="text" className='border-2 rounded w-full p-2' value={message} onChange={function (e) { setMessage(e.target.value) }}></input>

                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" class="btn btn-primary" onClick={function () { handleComment(commentId) }}>Save Comment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {post.comments ? post.comments.map(comment => (
                                comment.message
                            )) : "No Comments here"}

                        </div>
                    ))}
                </div>
                <Rightbar/>
            </div>
        </div>

    )
}

export default AllBlogs
