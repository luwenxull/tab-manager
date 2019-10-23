import React from 'react';
import Dialog from '@material-ui/core/Dialog';

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
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        {
          props.render(handleClose)
        }
      </Dialog>
    </>
  );
}
