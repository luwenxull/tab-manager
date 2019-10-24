import React from 'react'
import Dialog from './components/Dialog.jsx'
import MD from './conditionalRequre'

export default function SaveAsGroup(props) {
  let groupName;

  function updateGroupName(e) {
    groupName = e.target.value
  }

  return (
    <Dialog
      trigger={
        <MD.Button color="primary">
          {props.triggerText}
        </MD.Button>
      }
      render={
        (handleClose) => {
          return (
            <>
              <MD.DialogContent>
                <MD.DialogContentText>
                  将选中页面页面保存为组。默认选中所有页面
                </MD.DialogContentText>
                <MD.TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="组名称"
                  placerholer="请输入组名称"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onChange={updateGroupName}
                />
              </MD.DialogContent>
              <MD.DialogActions>
                <MD.Button onClick={handleClose} color="primary">
                  取消
                </MD.Button>
                <MD.Button
                  onClick={() => {
                    props.confirm(groupName, handleClose)
                  }}
                  color="primary"
                >
                  保存
                </MD.Button>
              </MD.DialogActions>
            </>
          )
        }
      }
    />
  )
}
