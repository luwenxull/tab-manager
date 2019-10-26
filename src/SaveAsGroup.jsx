import React from 'react'
import C from './components'
import MD from './mdui'

export default function SaveAsGroup(props) {
  let groupName;

  function updateGroupName(e) {
    groupName = e.target.value
  }

  return (
    <C.Dialog
      dialog={
        {
          fullWidth: true,
          maxWidth: 'sm'
        }
      }
      trigger={
        <MD.Button color="primary">
          {props.triggerText}
        </MD.Button>
      }
      render={
        (handleClose) => {
          return (
            <>
              <MD.DialogTitle>组名</MD.DialogTitle>
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
                <MD.Button onClick={handleClose} color="secondary">
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
