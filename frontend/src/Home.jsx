import React, {useEffect, useState} from "react";
import PostsList from "./components/PostsList.jsx";
import InputField from "./components/InputField.jsx";
import ActionButton from "./components/ActionButton.jsx";
import {POSTS_API} from "./services";


const Home = () => {
    const [user, setUser] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);

    const [posts, setPosts] = useState([]);
    const [message, setMessage] = useState("");

    async function retrievePosts() {
        try {
            const response = await fetch(POSTS_API, {
                method: "GET",
                headers: {}
            });

            if (!response.ok) {
                console.log(`HTTP error! Status: ${response.status}`);
            }

            console.log('Response from API:', response);

            const data = await response.json();
            console.log('Data from API:', data);

            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }

    async function createPost(post) {
        // ...
    }

    useEffect(() => {retrievePosts().then()}, [])

    return (
        <div className="homeWrapper">
            <div className="search-input">
                {loggedIn ? (
                    <InputField
                        title="Make a post"
                        value={message}
                        setValue={setMessage}
                        placeholder="Enter the message"
                    />
                ) : (
                    <InputField
                        title="Login"
                        value={user}
                        setValue={setUser}
                        placeholder="Enter the username"
                    />
                )}

            </div>

            <div className="postsTitle">
                {loggedIn ? (
                    <>
                        <ActionButton action={() => {
                            createPost(message).then()
                        }} title="Post"/>
                        <ActionButton action={() => {
                            setLoggedIn(false);
                            setUser("");
                        }} title="Log out"/>
                    </>
                ) : (
                    <ActionButton action={() => {
                        setLoggedIn(true);
                    }} title="Enter"/>
                )}
            </div>


                <p>Posts</p>
                <PostsList posts={posts}/>
            </div>
            )
            }

export default Home