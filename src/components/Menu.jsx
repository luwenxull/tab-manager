import React from 'react';
import MD from '../mdui'

export default function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (action) => {
    setAnchorEl(null);
    typeof action === 'function' && action(props.actionData);
  };

  return (
    <div>
      <div onClick={handleClick}>
        {props.trigger}
      </div>
      <MD.Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {
          props.menuItems.map((item, index)=> {
            return <MD.MenuItem key={index} onClick={() => {
              handleClose(item.action)
            }}>{item.text}</MD.MenuItem>
          })
        }
      </MD.Menu>
    </div>
  );
}
