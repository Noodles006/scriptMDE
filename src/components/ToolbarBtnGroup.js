import React from 'react';
import ToolbarBtn from './ToolbarBtn';

const ToolbarBtnGroup = (props) => {
  return (
    <div
      className="btn-group mr-2"
      role="group"
      aria-label="First group"
    >
      {
        props.meta.map((item, index) => <ToolbarBtn key={index} meta={item} />)
      }
    </div>
  );
};

export default ToolbarBtnGroup;
