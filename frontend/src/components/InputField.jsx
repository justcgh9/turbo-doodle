import React from 'react';

const InputField = (props) => {
  return (
      <div>
          <p>{props.title}</p>
          <input
              onChange={(e) => props.setValue(e.target.value)}
              value={props.value}
              className="Input"
              placeholder={(props.placeholder) ? props.placeholder : ''}
          />
      </div>
  );
};

export default InputField;
