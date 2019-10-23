import React, { Component } from 'react'
import MD from './conditionalRequre';
import WindowC from './Window.jsx';

export default class Group extends Component {
  constructor(props) {
    super(props)
    this.deleteGroup = this.deleteGroup.bind(this)
    this.updateGroup = this.updateGroup.bind(this)
    this.addGroup = this.addGroup.bind(this)
  }

  deleteGroup() {
    chrome.storage.local.get(['savedGroups'], result => {
      chrome.storage.local.set({
        savedGroups: result.savedGroups.filter(group => group.id !== this.props.group.id)
      })
    })
  }

  updateGroup(tabs) {
    chrome.storage.local.get(['savedGroups'], result => {
      const group = result.savedGroups.find(group => group.id === this.props.group.id)
      group.window.tabs = tabs
      chrome.storage.local.set({
        savedGroups: result.savedGroups
      })
    })
  }

  addGroup(name, window, callback) {
    // TODO validate
    // chrome.storage.local.clear()
    chrome.storage.local.get(['savedGroups'], result => {
      const groups = [].concat(result.savedGroups || [])
      groups.push(
        {
          name: name,
          id: Date.now(),
          window: {
            isFake: true,
            tabs: window.tabs.map(tab => {
              return {
                favIconUrl: tab.favIconUrl,
                title: tab.title,
                url: tab.url,
                id: tab.id,
              }
            })
          },
        }
      )
      chrome.storage.local.set({
        savedGroups: groups,
      }, callback)
    })
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
          />
        )
      })
    } else {
      return (
        <WindowC
          window={this.props.group.window}
          updateGroup={this.updateGroup}
          addGroup={this.addGroup}
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
