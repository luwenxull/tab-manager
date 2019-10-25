import React, { Component } from 'react';
import MD from './conditionalRequre';
import Group from './Group.jsx';
import './global.css';
import { copyTab } from './util';
import { SavedGroupsContext } from './context'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      groups: [],
      savedGroups: [],
    }
    this.setGroups = this.setGroups.bind(this)
    this.tabChange = this.tabChange.bind(this)
  }

  setGroups() {
    chrome.storage.local.get(['savedGroups'], result => {
      const savedGroups = result.savedGroups || []
      chrome.windows.getAll({ populate: true }, ws => {
        const groups = [
          {
            name: '当前活动页',
            id: Date.now(),
            unnamed: true,
            windows: ws.filter(w => w.tabs.length).map(w => {
              return {
                isFake: false,
                id: w.id,
                tabs: w.tabs.map(copyTab).filter(tab => {
                  if (
                    tab.title === 'Tab Manager'
                    && tab.url.indexOf('chrome-extension://') > -1
                    && tab.url.indexOf('tm-options.html') > -1
                  ) {
                    return false
                  }
                  return true
                })
              }
            }),
          }
        ]
        this.setState({
          groups: groups.concat(savedGroups),
          savedGroups,
        })
      })
    })
  }

  componentDidMount() {
    this.setGroups()
    chrome.tabs.onCreated.addListener(this.setGroups)
    chrome.tabs.onRemoved.addListener(this.setGroups)
    chrome.storage.onChanged.addListener(this.setGroups)
    chrome.tabs.onUpdated.addListener((tabid, info) => {
      if (info.status === 'complete') {
        this.setGroups()
      }
    })
  }

  tabChange(v, newValue) {
    this.setState({
      value: newValue
    })
  }

  render() {
    let value = this.state.value
    if (this.state.groups.length < value + 1) {
      value = 0
    }
    const group = this.state.groups.find((g, i) => i === value)
    return (
      <>
        <MD.AppBar position="static" color="primary">
          <MD.Tabs
            value={value}
            onChange={this.tabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {
              this.state.groups.map((group, index) => {
                return <MD.Tab label={group.name} key={index} />
              })
            }
          </MD.Tabs>
        </MD.AppBar>
        <MD.Box p={2}>
          <SavedGroupsContext.Provider value={this.state.savedGroups}>
            {
              group && <Group group={group} />
            }
          </SavedGroupsContext.Provider>
        </MD.Box>
      </>
    );
  }
}

export default App;
