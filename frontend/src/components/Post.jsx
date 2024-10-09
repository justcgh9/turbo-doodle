import React, {useState} from 'react';
import styled from "styled-components";
import {hexToRgb} from "./Card";

const Post = (props) => {

  const { post, setOpenForm, makeLike, loggedIn } = props;

  const [liked, setLiked] = useState(post.liked);

  const PostWrapper = styled.div`
    width: 500px;

    max-width: 80vw;
    /*height: 300px;*/
    min-height: 10vh;
    box-shadow: unset;

    border-radius: 1rem;
    padding: 10px;
    
    background-color: ${(post.color)
        ? `rgba(${hexToRgb(post.color)}, 0.73)`
        : 'rgba(255, 255, 255, 0.63)'};
      
    h1, div {
        color: white;
    }

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  `

  return (
      <div className="FormPositionWrapper" onClick={() => setOpenForm(false)}>
          <PostWrapper
              onClick={(e) => e.stopPropagation()}>
              <h1>{post.title}</h1>
              <div>{post.content}</div>
              <div className="likeButton">
                  {loggedIn && !liked ? (
                      <button className="MyButton" onClick={() => {
                          makeLike(post.id);
                          setLiked(true);
                      }}>Like</button>
                  ) : null}

              </div>

          </PostWrapper>
      </div>
  );
};

export default Post;
