import React, { Component } from 'react'
import MD from './mdui'
import C from './components'
import { SavedGroupsContext } from './context'

export default class SendToGroup extends Component {

  constructor(props) {
    super(props)
    this.state = {
      group: [],
      open: true,
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
  }

  handleChange(e) {
    this.setState({
      group: e.target.value
    })
  }

  handleSave() {
    this.props.handleSave(this.state.group)
  }

  get availableGroups() {
    return this.context.filter(group => group !== this.props.from)
  }

  render() {
    return (
      <C.Dialog
        controlledByOuter
        open={this.props.open}
        requestClose={this.props.handleClose}
        dialog={
          {
            fullWidth: true,
            maxWidth: 'sm',
          }
        }
      >
        <MD.DialogTitle>选择组</MD.DialogTitle>
        <MD.DialogContent>
          <MD.FormControl variant="filled" fullWidth disabled={this.availableGroups.length === 0}>
            <MD.InputLabel htmlFor="group">组名</MD.InputLabel>
            <MD.Select
              fullWidth
              multiple
              value={this.state.group}
              onChange={this.handleChange}
              inputProps={{
                name: 'group',
                id: 'group',
              }}
            >
              {
                this.availableGroups.map(group => {
                  return <MD.MenuItem value={group} key={group.id}>{group.name}</MD.MenuItem>
                })
              }
            </MD.Select>
          </MD.FormControl>
        </MD.DialogContent>
        <MD.DialogActions>
          <MD.Button onClick={this.props.handleClose} color="secondary">
            取消
          </MD.Button>
          <MD.Button
            onClick={this.handleSave}
            color="primary"
          >
            保存
          </MD.Button>
        </MD.DialogActions>
      </C.Dialog>
    )
  }
}

SendToGroup.contextType = SavedGroupsContext
