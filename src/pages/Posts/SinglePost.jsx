import { React, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useContext } from 'react'
import { AuthContext } from '../../context/Auth'

const SingleBlog = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [img, setImg] = useState('')
    const [comments, setComments] = useState([])
    const [currentCommentId,setCurrentCommentId] =useState('')
    const [message, setMessage] = useState('')
    const { auth, setAuth } = useContext(AuthContext)

    const { id } = useParams()

    useEffect(function () {
        const fetchData = async function () {
            try {
                const response = await fetch(`https://socialmedia-backend.vercel.app/singlePost/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.log('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                toast.success('Successful')
                setTitle(result.title)
                setDescription(result.description)
                setImg(result.postImage)

            }
            catch (error) {
                toast.error(`Failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    useEffect(function () {
        const fetchData = async function () {
            try {
                const response = await fetch(`https://socialmedia-backend.vercel.app/getComment/${id}`, {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.log('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                toast.success('Successful')
                setComments(result)

            }
            catch (error) {
                toast.error(`Failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleComment = async function (commentId) {
        console.log('')
        try {
            const response = await fetch(`https://socialmedia-backend.vercel.app/deleteComment/${id}/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (!response.ok) {
                return toast.error('Something went wrong')
            }
            const result = await response.json();
            console.log(result)
            toast.success('Comment Deleted')
            const filter = comments.filter(comment => comment._id !== commentId)
            setComments(filter)
        }
        catch (error) {
            toast.error(`Failed ${error.message}`)
            console.log(error)
        }
    }

    const handleUpdate = async function (commentId) {
        console.log('')
        try {
            const response = await fetch(`https://socialmedia-backend.vercel.app/updateComment/${id}/${commentId}`, {
                method: 'POST',
                body: JSON.stringify({ message }),
                headers: { 'Content-Type': "application/json" },
                credentials: 'include'
            })
            if (!response.ok) {
                return toast.error('You are not owner of this comment')
            }
            const result = await response.json();
            console.log(result)
            toast.success('Comment Updated')
            const updatedComments = comments.map(comment =>
                comment._id === commentId ? { ...comment, message: result.post.comments.find(c => c._id === commentId).message } : comment
            );
            setComments(updatedComments);
        }
        catch (error) {
            toast.error(`Failed ${error.message}`)
            console.log(error)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center bg-gray-300'>
            <Navbar />
            <div className='w-full flex'>
                <Sidebar />
                <div className='flex flex-col justify-start items-start m-auto w-[70%]'>
                    <p className='text-3xl font-bold'>Post</p>
                    <p className='text-md text-left font-medium mb-3'>{description}</p>
                    {img ? (<img className='mb-3 w-[50%]' src={`https://socialmedia-backend.vercel.app/${img}`}></img>) : ''}
                    <div className='w-[70%]'>
                        <h1 className='text-2xl font-bold'>Comments</h1>
                        {comments.map(comment => (
                            <div className='bg-gray-200 px-3 py-2 m-2'>
                                <div className='flex justify-start items-center gap-3'>
                                    <p className='w-[10%%] mb-3'><img className='rounded-[30px] w-[50px] h-[50px]' src={`https://socialmedia-backend.vercel.app/${comment.userId.profileImage}`}></img></p>
                                    <p className='text-xl text-center font-semibold mb-3'>{comment.userId.name}</p>
                                </div>
                                <div className='flex items-center'>
                                    <p className='w-full' >{comment.message}</p>
                                    <div className='flex gap-3 text-xl'>
                                    {auth.user._id === comment.userId._id ? <i class="fa-solid fa-trash" onClick={function () { handleComment(comment._id) }}></i> : ''}
                                    {auth.user._id === comment.userId._id ? <i class="fa-regular fa-pen-to-square" onClick={function () { setCurrentCommentId(comment._id) }} data-bs-toggle="modal"  data-bs-target="#exampleModal0"></i> : ''}
                                    
                                    </div>
                                    {/* <!-- Comments Modal --> */}
                                    <div class="modal fade" id="exampleModal0" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                        <div class="modal-dialog">
                                            <div class="modal-content">
                                                <div class="modal-header">
                                                    <h1 class="modal-title fs-5" id="exampleModalLabel" className='font-semibold text-xl'>Edit Comment</h1>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <input type="text" className='border-2 rounded w-full p-2' value={message} onChange={function (e) { setMessage(e.target.value) }}></input>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-primary" onClick={function () { handleUpdate(currentCommentId) }}>Save Comment</button>
                                                </div>
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

export default SingleBlog
