import React from 'react';

const ActionButton = (props) => {
  return (
      <a className="MyButton search-class" onClick={() => {
        props.action()
      }}>{props.title}</a>
  );
};

export default ActionButton;
