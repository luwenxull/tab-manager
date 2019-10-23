import React, { Component } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
            name: '未命名',
            windows: ws.filter(w => w.tabs.length),
            id: Date.now(),
          }
        ]
        this.setState({
          groups: groups.concat(savedGroups)
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
    return (
      <div>
        <Tabs value={value} onChange={this.tabChange}>
          {
            this.state.groups.map((group, index) => {
              return <Tab label={group.name} key={index}/>
            })
          }
        </Tabs>
        {
          this.state.groups.filter((g, i) => i === value).map(group => {
            return <Group group={group} key={group.id}/>
          })
        }
      </div>
    );
  }
}

export default App;
