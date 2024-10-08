import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Profile from './pages/Profile';
import AdminPage from './pages/AdminPage';
import UpdatePassword from './pages/Auth/UpdatePassword';
import Home from './pages/Home';
import ForgetPassword from './pages/Auth/ForgetPassword';
import Otp from './pages/Auth/Otp';
import UserInfo from './pages/UserInfo';
import Single from './pages/Single';
import AllPosts from './pages/Posts/AllPosts';
import SinglePost from './pages/Posts/SinglePost';
import UpdatePost from './pages/Posts/UpdatePost';
import { AuthProvider } from './context/Auth';
import Follow from './pages/Posts/Follow';
import Blocklist from './pages/Posts/Blocklist';

const App = () => {


    return (
        <AuthProvider>
            <BrowserRouter>
                <Toaster />
                <Routes>
                    <Route path='/' element={<Home />}></Route>
                    <Route path='/admin' element={<AdminPage />}></Route>
                    <Route path='/profile' element={<Profile />}></Route>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='/update-password' element={<UpdatePassword />}></Route>
                    <Route path='/forget-password' element={<ForgetPassword />}></Route>
                    <Route path='/otp' element={<Otp />}></Route>
                    <Route path='/user' element={<UserInfo />}></Route>
                    <Route path='/single/:id' element={<Single />}></Route>
                    <Route path='/allposts' element={<AllPosts />}></Route>
                    <Route path='/singlePost/:id' element={<SinglePost />}></Route>
                    <Route path='/updatePost/:id' element={<UpdatePost />}></Route>
                    <Route path='/follow' element={<Follow />}></Route>
                    <Route path='/blocklist' element={<Blocklist />}></Route>

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};
export default App;