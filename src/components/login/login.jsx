import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './login.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'; 
import { auth, db } from '../lib/firebase'; 
import { doc, setDoc } from "firebase/firestore"; 
import upload from '../lib/upload';


const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: "",
    });

    const [loading, setLoading] = useState(false)

    const handleAvatar = e => {
        const file = e.target.files[0];
        if (file) {
            setAvatar({
                file: file,
                url: URL.createObjectURL(file)
            });
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)

        const formData = new FormData(e.target)

        const {email, password} = Object.fromEntries(formData)

        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }finally{
            setLoading(false)
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData(e.target)

        const {username, email, password} = Object.fromEntries(formData)

        const imgUrl = await upload(avatar.file)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            await setDoc(doc(db, "users", res.user.uid), {
                id: res.user.uid,
                username,
                avatar: imgUrl,
                email,
                password,
                blocked:[],
            });

            await setDoc(doc(db, "userchat", res.user.uid), {
                chats: [],
            });

            toast.success("Register successful!");
        } catch (error) {
            console.log(error)
            toast.error("Error !");
        }finally{
            setLoading(false)
        }
    };

    return (
        <div className='login'>
            <div className='signin'>
                <h1>Welcome Back</h1>
                <form onSubmit={handleLogin}>
                    <input type='text' placeholder='Email' id='email' name='email'/>
                    <input type='password' placeholder='Password' id='password' name='password'/>
                    <button type="submit" disabled = {loading}>{loading ? "Loading..." : "Sign In"}</button>
                </form>
            </div>
            <div className='seperator'></div>
            <div className='signup'>
                <h1>Create Account</h1>
                <form onSubmit={handleRegister}>
                    <label htmlFor='file'>
                        <img src={avatar.url || './avatar.png'} alt="Avatar"/>
                        Upload Profile Picture
                    </label>
                    <input type='file' id='file' style={{display: 'none'}} onChange={handleAvatar}/>
                    <input type='text' placeholder='Username' id='username' name='username'/>
                    <input type='text' placeholder='Email' id='signup-email' name='email'/>
                    <input type='password' placeholder='Password' id='signup-password' name='password'/>
                    <button type="submit" disabled = {loading}>{loading ? "Loading..." : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
