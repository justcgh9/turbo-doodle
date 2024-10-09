import React from 'react';
import Card from "./Card.jsx";

const PostsList = (props) => {
    const { posts, setPost, setOpenForm } = props;

    const colorMap = {
        orange: 'FFA500FF',
        aqua: '00FFFFFF',
        crimson: 'DC143CFF',
        red: 'FF0000FF',
        violet: '8A2BE2FF',
        seagreen: '20B2AAFF',
        green: 'ADFF2FFF',
        blue: '0000FFFF',
        pink: 'FF1493FF',
        cyan: '72FAFAFF'
    }

    function getColor(chatId) {
        const keys = Object.keys(colorMap);
        const numericId = Array.from(chatId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const index = numericId % keys.length;
        return colorMap[keys[index]];
    }

  return (
      <div className="ChatsList">
          {posts.map((item, index) => (
              <Card
                  key={index}
                  name={item.username}
                  post={item.content}
                  color={getColor(item.username)}
                  setPost={setPost}
                  setOpenForm={setOpenForm}
              />
          ))}
      </div>
  );
};

export default PostsList;
