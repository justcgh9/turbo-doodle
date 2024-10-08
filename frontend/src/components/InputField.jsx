import React from 'react';

const InputField = (props) => {
  return (
      <div style={{display: "flex", alignItems: "center", flexDirection: "column"}}>
          <p>{props.title}</p>
          <input
              onChange={(e) => props.setValue(e.target.value)}
              value={props.value}
              className="Input"
              placeholder={(props.placeholder) ? props.placeholder : ''}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                      props.enter();
                  }
              }}
          />
      </div>
  );
};

export default InputField;
