import React, {useEffect, useState} from "react";
import PostsList from "./components/PostsList.jsx";
import InputField from "./components/InputField.jsx";
import ActionButton from "./components/ActionButton.jsx";
import {LIKES_API, POSTS_API, USERS_API} from "./services";
import Post from "./components/Post.jsx";


const Home = () => {
    const [user, setUser] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState("");

    const [openForm, setOpenForm] = useState(false);
    const [post, setPost] = useState({
        title: "",
        content: "",
        color: ""
    });

    const [likes, setLikes] = useState([]);

    async function retrievePosts() {
        try {
            const response = await fetch(POSTS_API, {
                method: "GET",
                headers: {}
            });

            if (!response.ok) {
                console.log(`HTTP error (get)! Status: ${response.status}`);
            }

            console.log('Response from API:', response);

            const data = await response.json();
            console.log('Data from API:', data);

            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    async function retrieveLikes(messageId) {
        try {
            const getURL = `${USERS_API}?username=${user}&messageId=${messageId}`;
            const response = await fetch(getURL, {
                method: "GET",
                headers: {}
            });

            if (!response.ok) {
                console.log(`HTTP error (get)! Status: ${response.status}`);
            }

            console.log('Response from API:', response);

            const data = await response.text();
            console.log('Data from API:', data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    async function makeLike(messageId) {
        // ...
    }

    async function createPost() {
        try {
            const response = await fetch(POSTS_API, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: user,
                    content: message
                })
            })

            if (!response.ok) {
                console.log(`HTTP error (post)! Status: ${response.status}`);
            }

            retrievePosts().then()
            setMessage("")
        } catch (error) {
            console.error('Error creating post:', error);
        }
    }

    async function login() {
        if (!user) {
            return
        }

        const getURL = `${USERS_API}?username=${user}`;
        const getResponse = await fetch(getURL, {
            method: "GET"
        })

        if (getResponse.ok) {
            // User has been created before
            setLoggedIn(true);
            return;
        }

        const postResponse = await fetch(USERS_API, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: user
            })
        })

        if (!postResponse.ok) {
            console.log(`HTTP error (post)! Status: ${postResponse.status}`);
        }

        setLoggedIn(true);
    }

    function logout() {
        setLoggedIn(false);
        setUser("");
        setMessage("");
    }

    useEffect(() => {retrievePosts().then()}, [])

    return (
        <div className="homeWrapper">
            <div className="search-input">
                {openForm ? (
                   <Post setOpenForm={setOpenForm} post={post}/>
                ) : null}

                {loggedIn ? (
                    <InputField
                        title={`Make a post, ${user}`}
                        value={message}
                        setValue={setMessage}
                        placeholder="Enter the message"
                        enter={() => {createPost().then()}}
                    />
                ) : (
                    <InputField
                        title="Login"
                        value={user}
                        setValue={setUser}
                        placeholder="Enter the username"
                        enter={() => {login().then()}}
                    />
                )}

            </div>

            <div className="postsTitle">
                {loggedIn ? (
                    <>
                        <ActionButton action={() => {
                            createPost().then()
                        }} title="Post"/>
                        <ActionButton action={() => {
                            logout();
                        }} title="Log out"/>

                        {/*<ActionButton action={() => {*/}
                        {/*    retrieveLikes(10).then();*/}
                        {/*}} title="likes"/>*/}
                    </>
                ) : (
                    <ActionButton action={() => {
                        login().then()
                    }} title="Enter"/>
                )}
            </div>


                <p>Posts</p>
                <PostsList posts={posts} setPost={setPost} setOpenForm={setOpenForm}/>
            </div>
            )
            }

export default Home