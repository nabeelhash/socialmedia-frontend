import React from 'react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

import { Link } from 'react-router-dom'
import { useContext } from 'react';
import { AuthContext } from '../context/Auth';

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [img, setImg] = useState('')
    const [following, setFollowing] = useState([])
    const [followers, setFollowers] = useState([])

    const [coverImg, setCoverImg] = useState('')
    const [posts, setPosts] = useState([])
    const navigate = useNavigate()
    const [description, setDescription] = useState('')
    const [createFile, setCreateFile] = useState('')
    const [message, setMessage] = useState('');
    const {auth,setAuth} = useContext(AuthContext)
    const [commentId,setCommentId] = useState('')

    useEffect(function(){
        if(!auth){
            navigate('/')
            toast.error('Login First')

        }
    },[])

    useEffect(function () {
        const fetchData = async function () {
            try {
                console.log('click')
                let response = await fetch('http://localhost:4000/current', {
                    method: 'GET',
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                })
                if (!response.ok) {
                    return toast.error('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                // toast.success('User Info')
                setName(result.name);
                setEmail(result.email)
                setImg(result.profileImage)
                setCoverImg(result.coverImage)
                setFollowing(result.following)
                setFollowers(result.followers)

            }
            catch (error) {
                return console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(function () {
        const fetchData = async function () {
            try {
                console.log('click')
                let response = await fetch('http://localhost:4000/adminPosts', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    return toast.error('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                // toast.success('User Info')
                setPosts(result)
            }
            catch (error) {
                return console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleUpload = async function (e) {
        const file = e.target.files[0]
        try {
            const formData = new FormData();
            formData.append('pic', file)
            // Upload the image to the server
            let response = await fetch('http://localhost:4000/updatePic', {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('Image upload failed');
            }
            const result = await response.json()
            setImg(result.profileImage)
            console.log(result.profileImage)
            toast.success('Image uploaded successfully');
        }
        catch (error) {
            console.log(error);
            toast.error('An error occurred');
        }
    }

    const handleCoverUpload = async function (e) {
        const file = e.target.files[0]
        try {
            const formData = new FormData();
            formData.append('pic', file)
            // Upload the image to the server
            let response = await fetch('http://localhost:4000/coverPic', {
                method: 'PATCH',
                body: formData,
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('Image upload failed');
            }
            const result = await response.json()
            setCoverImg(result.coverImage)
            console.log(result.coverImage)
            toast.success('Image uploaded successfully');
        }
        catch (error) {
            console.log(error);
            toast.error('An error occurred');
        }
    }
    const imgUrl = `http://localhost:4000/${img}`
    const imgCoverUrl = `http://localhost:4000/${coverImg}`

    const createPost = async function (e) {
        e.preventDefault()
        try {
            const formData = new FormData();
            formData.append('pic', createFile)
            formData.append('description', description)
            // Upload the image to the server
            let response = await fetch('http://localhost:4000/createPost', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });
            if (!response.ok) {
                return toast.error('Image upload failed');
            }
            const result = await response.json()
            toast.success('New Post Created');
        }
        catch (error) {
            console.log(error);
            toast.error('An error occurred');
        }
    }

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


    const handleComment = async function (commentId) {
        console.log(commentId)

        try {
            let response = await fetch(`http://localhost:4000/comment/${commentId}`, {
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


    return (
        <div className='bg-gray-300 h-full'>
            <Navbar />
            <div className='flex h-[90%]'>
                <Sidebar />
                <div className='w-[100%] flex flex-col justify-start items-start m-auto md:p-3 bg-gray-200'>

                    <div className='flex flex-col relative w-full h-[300px] md:h-[600px]'>
                        <img src={imgCoverUrl} className='w-[100%] h-[600px] object-cover'></img>
                        <img src={imgUrl} className='w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] rounded-[100px] border-3 border-white absolute top-[92%] left-[12%] sm:top-[100%] sm:left-[12%] md:top-[90%] md:left-[15%] lg:top-[90%] lg:left-[12%] transform -translate-x-[50%] -translate-y-[50%]'></img>
                        <div className='z-10 absolute top-[10%] left-[90%] transform -translate-x-[50%] -translate-y-[50%] text-white'>
                            <div class="dropdown">
                                <button data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis text-2xl text-white bg-black rounded-[30px] py-1 px-2"></i>
                                </button>
                                <ul class="dropdown-menu px-3 py-2">
                                    <li data-bs-toggle="modal" data-bs-target="#exampleModal" class=" text-black text-md cursor-pointer" >Update Cover</li>
                                    <li data-bs-toggle="modal" data-bs-target="#exampleModal1" class=" text-black text-md cursor-pointer" >Update Profile</li>
                                </ul>
                            </div>
                        </div>
                        <div className='flex flex-row gap-2 my-2 absolute top-[90%] left-[58%] sm:top-[100%] sm:left-[50%] md:top-[90%] md:left-[58%] lg:top-[90%] lg:left-[38%] transform -translate-x-[50%] -translate-y-[50%]'>
                            <h1 className='text:xs md:text-3xl text-white '>{name}</h1>
                            <h1 className='text-xs md:text-lg text-white btn btn-primary'>{posts.length} Posts</h1>
                            <h1 className='text-xs md:text-lg text-white btn btn-primary'>{following.length} Following</h1>
                            <h1 className='text-xs md:text-lg text-white btn btn-primary'>{followers.length} Followers</h1>
                        </div>
                    </div>

                    {/* <!-- Cover Modal --> */}
                    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel" className='font-semibold text-xl'>Upload Cover Picture</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <input type='file' accept='image/' onChange={handleCoverUpload}></input>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Profile Modal --> */}
                    <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="exampleModalLabel" className='font-semibold text-xl'>Upload Profile Picture</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <input type='file' accept='image/' onChange={handleUpload}></input>

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex bg-gray-200 w-[100%] py-20'>
                        <div className='w-[90%] px-8 py-4 mx-auto bg-white rounded flex flex-col gap-3'>
                            <div className='flex items-center justify-center gap-3'>
                                <img src={imgUrl} className='w-[45px] h-[45px] rounded-[50px]'></img>
                                <textarea type="text" value={description} onChange={function (e) { setDescription(e.target.value) }} className='w-full h-[30px] px-2 py-1' placeholder='Whats in your mind?' />
                            </div>
                            <div className='flex justify-around md:justify-between'>
                                <input type="file" accept='image/*' onChange={function (e) { setCreateFile(e.target.files[0]) }} />
                                <button className="btn btn-primary" onClick={createPost}>Post</button>
                            </div>
                        </div>
                    </div>



                    <div className='flex flex-wrap items-center justify-center w-[90%] m-auto bg-gray-200'>
                        {posts.map(post => (
                            <div key={post._id} className='flex flex-col bg-white w-[90%] md:w-[70%] lg:w-[100%] justify-start items-center rounded  px-4 my-4 py-4'>
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
                                                <li className='text-black cursor-pointer' onClick={function () { handle(post._id) }}>Delete Blog</li>
                                                <Link to={`/updatePost/${post._id}`}><li className='text-black'>Edit</li></Link>
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
                                            <i class="fa-solid fa-thumbs-up text-2xl text-blue-600" onClick={function () { handleLike(post._id) }}></i>
                                            <p className='hidden md:block'>Like</p>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <i class="fa-solid fa-thumbs-down text-2xl text-red-600" onClick={function () { handleDislike(post._id) }}></i>
                                            <p className='hidden md:block'>Dislike</p>
                                        </div>

                                    </div>
                                    <div className='flex items-center gap-2' data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                        <i class="fa-regular fa-comment-dots text-black text-2xl" ></i>
                                        <p className='hidden md:block cursor-pointer' onClick={function(){setCommentId(post._id)}}>Comments</p>
                                    </div>
                                </div>
                                {/* <!-- Comments Modal --> */}
                                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            </div>
                        ))}
                    </div>
                </div>

            </div>


        </div>
    )
}

export default Profile
