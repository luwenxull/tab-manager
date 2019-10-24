import React, { Component } from 'react'
import MD from './conditionalRequre';
import WindowC from './Window.jsx';
import { copyTab } from './util';
import { SavedGroupsContext } from './context';

export default class Group extends Component {
  constructor(props) {
    super(props)
    this.deleteGroup = this.deleteGroup.bind(this)
    this.updateGroup = this.updateGroup.bind(this)
    this.addGroup = this.addGroup.bind(this)
  }

  deleteGroup() {
    chrome.storage.local.set({
      savedGroups: this.context.filter(group => group.id !== this.props.group.id)
    })
  }

  updateGroup(tabs) {
    const group = this.context.find(group => group.id === this.props.group.id)
    group.window.tabs = tabs
    chrome.storage.local.set({
      savedGroups: this.context
    })
  }

  addGroup(name, tabs, callback) {
    // TODO validate
    // chrome.storage.local.clear()
    const groups = this.context.concat([])
    groups.push(
      {
        name: name,
        id: Date.now(),
        window: {
          isFake: true,
          tabs: tabs.map(copyTab)
        },
      }
    )
    chrome.storage.local.set({
      savedGroups: groups,
    }, callback)
  }

  createWindow() {
    if (this.props.group.windows) {
      return this.props.group.windows.map((w, index) => {
        return (
          <WindowC
            key={index}
            window={w}
            updateGroup={this.updateGroup}
            addGroup={this.addGroup}
            group={this.props.group}
          />
        )
      })
    } else {
      return (
        <WindowC
          window={this.props.group.window}
          updateGroup={this.updateGroup}
          addGroup={this.addGroup}
          group={this.props.group}
        />
      )
    }
  }

  render() {
    return (
      <>
        <MD.Box m={2}>
          {
            !this.props.group.unnamed
            && (
              <MD.Button
                variant="contained"
                color="secondary"
                onClick={this.deleteGroup}
              >删除当前组</MD.Button>
            )
          }
        </MD.Box>
        {
          this.createWindow()
        }
      </>
    )
  }
}

Group.contextType = SavedGroupsContext
