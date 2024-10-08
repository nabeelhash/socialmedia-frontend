import { React, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import { useContext } from 'react'
import { AuthContext } from '../../context/Auth'

const Follow = () => {
    const [info, setInfo] = useState([]);
    const { auth, setAuth } = useContext(AuthContext)
    const [following, setFollowing] = useState([])
    const navigate = useNavigate()

    useEffect(function () {
        const check = localStorage.getItem('auth')
        if (!check) {
            navigate('/')
        }
    })

    useEffect(function () {
        const fetchData = async function () {
            try {
                const response = await fetch('https://socialmedia-backend.vercel.app/allUsers', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.log('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                // Filter out the logged-in user
                const filteredResult = result.filter(user => user.name !== auth.name);
                setInfo(filteredResult);
                toast.success('Users fetched successfully');
            }
            catch (error) {
                toast.error(`Login failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [auth.name])


    useEffect(function () {
        const fetchData = async function () {
            try {
                const response = await fetch('https://socialmedia-backend.vercel.app/following', {
                    method: 'GET',
                    credentials: 'include'
                })
                if (!response.ok) {
                    console.log('Something went wrong')
                }
                const result = await response.json();
                console.log(result)
                setFollowing(result)
                toast.success('Users fetched successfully');
            }
            catch (error) {
                toast.error(`Login failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleFollow = async function (id) {
        try {
            console.log('click')
            let response = await fetch(`https://socialmedia-backend.vercel.app/follow/${id}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                return toast.error('You are either already following this user or blocked this user')
            }
            const result = await response.json();
            console.log(result)
            const filter = [...following, result.userToFollow]
            setFollowing(filter)
            toast.success('Following user')

        }
        catch (error) {
            return console.log(error)
        }
    }

    const handleUnfollow = async function (id) {
        try {
            console.log('click')
            let response = await fetch(`https://socialmedia-backend.vercel.app/unfollow/${id}`, {
                method: 'GET',
                credentials: 'include'
            })
            if (!response.ok) {
                return toast.error('Something went wrong')
            }
            const result = await response.json();
            const filter = following.filter(following => following._id !== id)
            setFollowing(filter)
            toast.success('Successfully Unfollowed the user')

        }
        catch (error) {
            return console.log(error)
        }
    }



    return (
        <div className='h-screen'>
            <Navbar />
            {auth ?
                <div className='flex h-[90%]'>
                    <Sidebar />
                    <div className='flex flex-col w-full'>
                        <div className='w-full md:w-[60%] mx-auto py-20'>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col" className='font-semibold'>ProfilePic</th>
                                        <th scope="col" className='font-semibold'>Name</th>
                                        <th scope="col" className='font-semibold'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {info.map(info => (
                                        <tr key={info._id}>
                                            {auth.user._id !== info._id ?
                                            <>
                                        <td className='w-fit'><img className='w-[50px] h-[50px] rounded-[30px]' src={`https://socialmedia-backend.vercel.app/${info.profileImage}`}></img></td>
                                        <td>{info.name}</td>
                                        <td className='flex gap-2'>
                                            <button onClick={() => handleFollow(info._id)} className='btn btn-primary text-white transform transition-transform duration-200 hover:scale-105'>Follow</button>
                                            <button onClick={() => handleUnfollow(info._id)} className='btn btn-danger text-white transform transition-transform duration-200 hover:scale-105'>Unfollow</button>
                                        </td>
                                        </>
                                        : ''}
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h1 className='text-3xl font-bold mb-3'>Following Users</h1>

                        {following.map(following => (
                            <div className='bg-gray-500 text-xl text-white py-1'>
                                {following.name}
                            </div>
                        ))}
                    </div>
                </div>
                : ("You have to Login first")}
        </div>

    )
}

export default Follow
