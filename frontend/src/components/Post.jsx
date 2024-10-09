import React from 'react';
import styled from "styled-components";
import {hexToRgb} from "./Card";

const Post = (props) => {

  const { post, setOpenForm } = props;

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
        </PostWrapper>
      </div>
  );
};

export default Post;
