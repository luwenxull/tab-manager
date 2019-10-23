import React, { Component } from 'react';
import WindowTab from './Window.jsx';
import './global.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      windows: []
    }
    this.setWindows = this.setWindows.bind(this)
  }

  setWindows() {
    chrome.windows.getAll({populate: true}, ws => {
      this.setState({
        windows: ws.filter(w => w.tabs.length),
      })
      console.log(ws)
    })
  }
  
  componentDidMount() {
    this.setWindows()
    chrome.tabs.onCreated.addListener(this.setWindows)
    chrome.tabs.onRemoved.addListener(this.setWindows)
    chrome.tabs.onUpdated.addListener((tabid, info) => {
      if (info.status === 'complete') {
        this.setWindows()
      }
    })
  }
  
  render() {
    return (
      <div>
        {
          this.state.windows.map(w => {
            return <WindowTab window={w} key={w.id}/>
          })
        }
      </div>
    );
  }
}

export default App;
