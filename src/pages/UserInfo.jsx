import { React, useState } from 'react'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import Sidebar from '../components/Sidebar'

const UserInfo = () => {
    const [info, setInfo] = useState([]);
    const navigate = useNavigate()
    useEffect(function(){
        const verify = localStorage.getItem('abcd')
        if(!verify){
            return navigate('/allposts')
        }
    },[])
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
                toast.success('Login Successful')
                setInfo(result)
            }
            catch (error) {
                toast.error(`Login failed ${error.message}`)
                console.log(error)
            }
        }
        fetchData()
    }, [])

    const handleDelete = async function (id) {
        const warning = window.prompt('Are you sure you want to delete this user')
        if (!warning) {
            return
        }
        try {
            let response = await fetch(`https://socialmedia-backend.vercel.app/deleteUser/${id}`, {
                method: 'delete',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            })
            if (!response.ok) {
                return toast.error('Something went wrong')
            }
            const result = await response.json();
            console.log(result)
            let filter = info.filter(info => info._id !== id)
            setInfo(filter);

            toast.success(`New User '${result.name}' is Deleted`)
        }
        catch (error) {
            return console.log(error)
        }
    }

    return (
        <div className='h-screen'>
            <Navbar />
            <div className='flex h-[90%]'>
                <Sidebar />
                <div className='w-full md:w-[60%] mx-auto py-20'>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {info.map(info => (
                                <tr key={info._id}>
                                    <td>{info.name}</td>
                                    <td>{info.email}</td>
                                    <td>
                                        <button onClick data-bs-toggle="modal" data-bs-target="#exampleModal" className='btn btn bg-gradient-to-r from-blue-500 to-purple-500 text-white transform transition-transform duration-200 hover:scale-105 mr-2'>Edit</button>
                                        <button onClick={() => handleDelete(info._id)} className='btn btn bg-gradient-to-r from-orange-500 to-red-600 text-white transform transition-transform duration-200 hover:scale-105'>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    )
}

export default UserInfo
