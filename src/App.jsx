import React, { Component } from 'react';
import WindowTab from './Window.jsx';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      windows: []
    }
  }

  componentDidMount() {
    chrome.windows.getAll({populate: true}, ws => {
      this.setState({
        windows: ws,
      })
      console.log(ws)
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
