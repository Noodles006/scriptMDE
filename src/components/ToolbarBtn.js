import React from 'react';
import fontawesome from '@fortawesome/fontawesome';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import brands from '@fortawesome/fontawesome-free-brands';
import solids from '@fortawesome/fontawesome-free-solid';

fontawesome.library.add(brands, solids);

const ToolbarBtn = (props) => {
  const { tooltip, icon, theme = 'light', size = 'sm', click } = props.meta;
  const btnClassName = `btn btn-${theme} btn-${size}`;
  const iconOpts = icon.indexOf(' ') !== -1 ? icon.split(' ') : icon;

  return (
    <button
      type="button"
      className={btnClassName}
      data-toggle="tooltip"
      data-placement="bottom"
      title={tooltip}
      onClick={click}
    >
      <FontAwesomeIcon icon={iconOpts} />
    </button>
  );
};

export default ToolbarBtn;
