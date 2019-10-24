import React, { Component } from 'react';
import MD from './conditionalRequre';
import Group from './Group.jsx';
import './global.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      groups: [],
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
            windows: ws.filter(w => w.tabs.length),
          }
        ]
        this.setState({
          groups: groups.concat(savedGroups)
          // groups,
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
      <div>
        <MD.AppBar position="static" color="default">
          <MD.Tabs
            value={value}
            onChange={this.tabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            {
              this.state.groups.map((group, index) => {
                return <MD.Tab label={group.name} key={index}/>
              })
            }
          </MD.Tabs>
        </MD.AppBar>
        <MD.Box p={2}>
          {
            group && <Group group={group} />
          }
        </MD.Box>
      </div>
    );
  }
}

export default App;
