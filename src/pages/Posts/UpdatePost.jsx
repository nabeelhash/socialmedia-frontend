import { React, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

const UpdateBlog = () => {
    const [description, setDescription] = useState('')
    const [img, setImg] = useState('')
    const [file, setFile] = useState(null)
    const navigate = useNavigate()

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
                setDescription(result.description)
                setImg(result.postImage)

            }
            catch (error) {
                toast.error(`Failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [id])

    const handle = function (e) {
        setFile(e.target.files[0])
    }

    const handleSubmit = async function (e) {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('pic', file); // Append file to FormData
            formData.append('description', description);
            const response = await fetch(`https://socialmedia-backend.vercel.app/updatePost/${id}`, {
                method: 'PATCH',
                credentials: 'include',
                body: formData
            })
            if (!response.ok) {
                toast.error('error')
                return console.log('Something went wrong')
            }
            const result = await response.json();
            console.log(result)
            toast.success('Post Updated Successfully')
            navigate('/allposts')
        }
        catch (error) {
            console.log(error.message)
        }
    }




    return (
        <div className='bg-gray-300'>
            <Navbar />
            <div className='flex '>
                <Sidebar />
                <div className='w-[70%] m-auto flex flex-col items-center py-10 px-20'>
                    <div class="flex flex-col w-full">
                        <label for="exampleInputEmail1" class="form-label">Post</label>
                        <textarea type="email" className='bg-gray-200 h-[300px] rounded w-full px-3 py-2 border-gray-500 border-[2px] mt-1 mb-2' placeholder='Type Your Blog Title' id="exampleInputEmail1" value={description}
                            onChange={function (e) { setDescription(e.target.value) }} aria-describedby="emailHelp" />
                    </div>
                    <input type='file' accept='image/*' onChange={handle}></input>
                    <img className='my-3 w-[50%]' src={`https://socialmedia-backend.vercel.app/${img}`}></img>
                    <button className='text-white bg-black rounded px-4 py-2 transform transition-transform duration-200 hover:scale-110 hover:bg-blue-700' onClick={handleSubmit}>Update Blog</button>

                </div>
            </div>

        </div>
    )
}
export default UpdateBlog
