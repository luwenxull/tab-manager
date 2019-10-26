import React from 'react';
import MD from '../mdui';

export default function Dialog(props) {
  const [open, setOpen] = React.useState(props.defaultOpened || false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (props.controlledByOuter) {
      typeof props.requestClose === 'function' && props.requestClose()
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      {
        !props.controlledByOuter && <div onClick={handleClickOpen}>{props.trigger}</div>
      }
      <MD.Dialog
        open={props.controlledByOuter ? props.open : open}
        onClose={handleClose}
        {...(props.dialog || {})}
      >
        {
          props.controlledByOuter ? props.children : props.render(handleClose)
        }
      </MD.Dialog>
    </>
  );
}
