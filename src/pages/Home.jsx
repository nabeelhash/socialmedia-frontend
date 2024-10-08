import React from 'react'
import { Link } from 'react-router-dom'
import bgImage from '../bg.jpg';
import Navbar from '../components/Navbar';
const Home = () => {
    return (
        <div>
            <Navbar />
            <div className="h-[658px] md:h-[667px] bg-cover bg-mix-blend-overlay flex flex-col justify-center items-center " style={{ backgroundImage: `url(${bgImage})` }}>
                <div className='opacity-30 bg-black h-screen absolute inset-0'></div>
                <div className='w-[100%] md:w-[80%] h-[80%] py-5 px-10 z-10'>
                    <h1 className='text-[40px] md:text-6xl text-white font-bold'>Welcome To Social Media Website</h1>
                    <div className='text-[14px] md:text-[18px] font-semibold text-black my-12'>
                        <Link to={'/allposts'}><button className='bg-white rounded px-10 py-2 transform transition-transform duration-200 hover:scale-110 ' >Check Posts</button></Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home
