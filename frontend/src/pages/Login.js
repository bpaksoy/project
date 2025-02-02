import { useState, useEffect, useContext } from 'react';
import { baseUrl } from '../shared';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LoginContext } from '../App';
import Colleges from './Colleges';
import graduation from "../assets/images/graduation.jpg";
import { Navigate } from 'react-router-dom';
import axios from "axios";

export default function Login() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    //console.log("logged in", loggedIn)
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();


    const login = async (e) => {
        e.preventDefault();
        const url = baseUrl + 'api/login/';

        try {
            const response = await axios.post(url, {
                username,
                password,
            });

            // ... Store the token in state ...
            localStorage.setItem('access', response.data.access);
            localStorage.setItem('refresh', response.data.refresh);

            // Redirect to home page after successful login
            setLoggedIn(true);
            navigate(
                location?.state?.previousUrl
                    ? location.state.previousUrl
                    : '/'
            );
        } catch (err) {
            // Handle error responses
            setError(err.response.status);
            console.log(`Error: ${err.response.status}`);
            // Check if the response status is 401 (Unauthorized)
            if (err.response.status === 401 || err.response.status === 400) {
                // Redirect to login page
                setUsername('');
                setPassword('');
                navigate('/login');
            }
        }
    };

    // ... rest of the component code ...

    // Check for token in localStorage on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // If token exists, redirect to home page
            navigate('/');
        }
    }, [navigate]); // Add navigate to dependency array

    // const login = (e) => {
    //     e.preventDefault();
    //     try {

    //         const url = baseUrl + 'api/login/';
    //         fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 username: username,
    //                 password: password,
    //             }),
    //         })
    //             .then((response) => {
    //                return response.json();
    //             })
    //             .then((data) => {
    //                 //console.log("data access in the login", data.access)
    //                 localStorage.setItem('access', data.access);
    //                 localStorage.setItem('refresh', data.refresh);
    //                 console.log("localStorage", localStorage.getItem('access'));
    //                 setLoggedIn(true);
    //                 navigate(
    //                     location?.state?.previousUrl
    //                         ? location.state.previousUrl
    //                         : '/'
    //                 );
    //             });
    //     } catch (error) {
    //         alert("Invalid username or password")
    //         setError(error.response.data.detail);
    //         if (error.response.status === 401) {
    //             // Redirect to login page
    //             navigate('/login');
    //         }
    //     }
    // }

    if (localStorage.getItem("auth_token")) {
        navigate('/')
    }

    return (
        <>
            {loggedIn ? <Navigate to="/" /> :
                <div className="py-16">
                    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                        <img className="hidden lg:block lg:w-1/2 bg-cover"
                            src={graduation} alt="graduation" />

                        <div className="w-full p-8 lg:w-1/2">
                            <h2 className="text-2xl font-semibold text-gray-700 text-center">Brand</h2>
                            <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                            <a href="#" className="flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                                <div className="px-4 py-3">
                                    <svg className="h-6 w-6" viewBox="0 0 40 40">
                                        <path
                                            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                            fill="#FFC107" />
                                        <path
                                            d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z"
                                            fill="#FF3D00" />
                                        <path
                                            d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z"
                                            fill="#4CAF50" />
                                        <path
                                            d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z"
                                            fill="#1976D2" />
                                    </svg>
                                </div>
                                <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign in with Google</h1>
                            </a>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="border-b w-1/5 lg:w-1/4"></span>
                                <a href="#" className="text-xs text-center text-gray-500 uppercase">or login with email</a>
                                <span className="border-b w-1/5 lg:w-1/4"></span>
                            </div>
                            {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">Invalid username or password</div>}
                            <form className="mt-4" onSubmit={login}>
                                <div className="mt-4">
                                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                                    <input id="username" className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="username" value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                        }} />
                                </div>
                                <div className="mt-4">
                                    <div className="flex justify-between">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                                        <a href="#" className="text-xs text-gray-500">Forget Password?</a>
                                    </div>
                                    <input id="password" value={password} className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none" type="password"
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                        }}
                                    />
                                </div>
                                <div className="mt-8" >
                                    <button className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600" >Login</button>
                                </div>
                            </form>
                            <div className="mt-4 flex items-center justify-between">
                                <span className="border-b w-1/5 md:w-1/4"></span>
                                <Link
                                    to="/register" className="text-xs text-gray-500 uppercase">or sign up</Link>
                                <span className="border-b w-1/5 md:w-1/4"></span>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </>
    );
}