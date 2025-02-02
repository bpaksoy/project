import React from 'react';
import College from './College';
import NotFound from './NotFound';
import Search from './Search';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { baseUrl } from '../shared';
import { LoginContext } from '../App';
import axios from "axios";



function SearchResults() {
    let { query } = useParams();
    //console.log("query in Search Results", query);
    const [loggedIn, setLoggedIn] = useContext(LoginContext);
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [searchError, setSearchError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [errorStatus, setErrorStatus] = useState();
    
    const navigate = useNavigate();
    const location = useLocation();

    const [backendData, setBackendData] = useState();


    async function fetchData() {
        const url = baseUrl + 'api/search/' + query;
        const options = {
            method: "GET",
            url: url
        }
        const response = await axios.request(options, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('access')}`
            }
        });
        // console.log("response in the search", response);
        if (response.status === 404) {
            setNotFound(true);
            navigate("/404");
        } else if (response.status === 401) {
            setLoggedIn(false);
            navigate("/login", {
                state: {
                    previousUrl: location.pathname
                }
            });
        }
        // if (!response.ok) {
        //     throw new Error("Something went wrong!")
        // }
        const data = response.data;
        setBackendData(data.college);
        setSearchResult(data.college);
    }

    useEffect(() => {
        fetchData();
    }, [searchResult]);

    //const handleSearch = async () => {
    //     setLoading(true)
    //     setSearchResult([])

    //     try {

    //         const options = {
    //             method: "GET",
    //             url: `${baseUrl}api/search/${query}`,
    //         }
    //         const response = await axios.request(options, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${localStorage.getItem('access')}`
    //             }
    //         });
    //         if (response.status === 404) {
    //             setNotFound(true);
    //         }
    //         else if (response.status === 401) {
    //             navigate("/login/", {
    //                 state: {
    //                     previousUrl: location.pathname
    //                 }
    //             });
    //         }
    //         setSearchResult(response.data.colleges);
    //         console.log("RESPONSE", response.data.colleges);

    //     } catch (error) {
    //         setSearchError(error);
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleSearch = async () => {

    //     console.log("query in Search Results", query);
    //     setLoading(true)
    //     setSearchResult([])
    //     try {
    //         const options = {
    //             method: "GET",
    //             url: `${baseUrl}api/search/${query}`,
    //         }
    //         const response = await axios.request(options);
    //         setSearchResult(response.data.results);
    //         console.log("RESPONSE", response.data.results);

    //     } catch (error) {
    //         setErrorStatus(error);
    //         console.log(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // useEffect(() => {
    //     handleSearch();
    // }, []);


    if (errorStatus === 404) {
        return (
            <>
                <NotFound />
                <Link to="/">Search another</Link>
            </>
        );
    }

    if (errorStatus) {
        return (
            <>
                <p>There was a problem with the server, try again later.</p>
                <Link to="/">Search another</Link>
            </>
        );
    }


    return (
        <div className="bg-primary min-h-screen rounded">
            <Search />
            {searchResult ? (
                <>
                    <div className="flex flex-wrap justify-center">
                        {searchResult.map((college) => {
                            const name = college.name;
                            const city = college.city;
                            const state = college.state;

                            const cost_of_attendance = college.cost_of_attendance
                            const acceptance_rate = college.admission_rate
                            const average_sat = college.sat_score

                            return (
                                <College
                                    key={college.id}
                                    id={college.id}
                                    name={name}
                                    city={city}
                                    state={state}
                                    acceptance_rate={acceptance_rate}
                                    average_sat={average_sat}
                                    cost_of_attendance={cost_of_attendance}
                                    img="https://images.unsplash.com/photo-1677594334053-afe4b41aa0a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNvbGxlZ2V8ZW58MHx8MHx8fDA%3D"
                                />
                            );
                        })}
                    </div>
                </>
            ) : (
                <p>Nothing found here</p>
            )}
        </div>
    )
}

export default SearchResults;