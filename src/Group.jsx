import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import WindowTab from './Window.jsx';

export default class Group extends Component {
  constructor(props) {
    super(props)
    this.deleteGroup = this.deleteGroup.bind(this)
  }

  deleteGroup() {
    chrome.storage.local.get(['savedGroups'], result => {
      chrome.storage.local.set({
        savedGroups: result.savedGroups.filter(group => group.id !== this.props.group.id)
      })
    })
  }

  render() {
    return (
      <>
        <Box m={2}>
          <Button
            variant="contained"
            color="secondary"
            onClick={this.deleteGroup}
            disabled={!Boolean(this.props.group.id)}
          >删除当前组</Button>
        </Box>
        {
          this.props.group.windows.map((w, index) => {
            return <WindowTab window={w} key={index} group={this.props.group}/>
          })
        }
      </>
    )
  }
}
