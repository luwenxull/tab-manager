import React from 'react';
import MD from '../conditionalRequre';

export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleClickOpen}>
        {props.trigger}
      </div>
      <MD.Dialog open={open} onClose={handleClose}>
        {
          props.render(handleClose)
        }
      </MD.Dialog>
    </>
  );
}
