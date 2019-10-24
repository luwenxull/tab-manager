import React, { Component } from 'react';
import MD from './conditionalRequre'
import Menu from './components/Menu.jsx';
import SaveAsGroup from './saveAsGroup.jsx'

class WindowC extends Component {
  constructor(props) {
    super(props)
    this.closeWindow = this.closeWindow.bind(this)
    this.updateGroupName = this.updateGroupName.bind(this)
    // this.handleChange = this.handleChange.bind(this)
    this.anchorEl = null
    this.menuItems = [
      {
        text: '打开',
        action: (tab) => {
          chrome.tabs.create({
            url: tab.url
          })
        }
      },
      {
        text: '关闭（移除）',
        action: (tab) => {
          if (this.props.window.isFake) {
            this.props.updateGroup(
              this.props.window.tabs.filter(tab_1 => tab_1 !== tab)
            )
          } else {
            chrome.tabs.remove(tab.id)
          }
        }
      }
    ]
    this.groupName = null;
    this.checked = []
  }

  jump(tab) {
    chrome.tabs.create({
      url: tab.url
    })
  }

  closeWindow() {
    if (this.props.window.notRealWindow) {
      console.log('eeeeeeeeee')
    } else {
      chrome.windows.remove(this.props.window.id)
    }
  }

  handleChange(checked, tab) {
    console.log({checked, tab})
    if (checked) {
      this.checked.push(tab)
    } else {
      const index = this.checked.indexOf(tab)
      if (index > -1) {
        this.checked.splice(index, 1)
      }
    }
  }

  showMenu(e) {
    this.anchorEl = e.currentTarget
    this.setState({
      anchorEl: e.currentTarget,
    })
  }

  closeMenu() {
    this.anchorEl = null
  }

  updateGroupName(e) {
    this.groupName = e.target.value
  }

  render() {
    return (
      <MD.ExpansionPanel defaultExpanded>
        <MD.ExpansionPanelSummary expandIcon={<MD.ExpandMoreIcon />}>
          {this.props.window.focused ? "当前窗口" : "其他窗口"}
        </MD.ExpansionPanelSummary>
        <MD.ExpansionPanelDetails>
          <MD.List className='full-width'>
            {
              this.props.window.tabs.map(tab => {
                return (
                  <MD.ListItem key={tab.id} dense>
                    <MD.ListItemIcon>
                      <MD.Checkbox
                        edge="start"
                        disableRipple
                        onChange={(e) => {
                          this.handleChange(e.target.checked, tab)
                        }}
                      />
                    </MD.ListItemIcon>
                    <MD.ListItemText
                      onClick={() => { this.jump(tab) }}
                      primary={tab.title}
                      secondary={tab.url}
                    />
                    <MD.ListItemSecondaryAction>
                      <Menu
                        menuItems={this.menuItems}
                        trigger={
                          <MD.IconButton>
                            <MD.MoreVertIcon />
                          </MD.IconButton>
                        }
                        actionData={tab}
                      >
                      </Menu>
                    </MD.ListItemSecondaryAction>
                  </MD.ListItem>
                )
              })
            }
          </MD.List>
        </MD.ExpansionPanelDetails>
        <MD.ExpansionPanelActions>
          {
            !this.props.window.isFake
              && <MD.Button color="secondary" onClick={this.closeWindow}>关闭窗口</MD.Button>
          }
          {
            !this.props.window.isFake
              && (
                <SaveAsGroup
                  triggerText="保存为组并关闭标签"
                  confirm={(name, handleClose) => {
                    this.props.addGroup(name, this.props.window, () => {
                      this.closeWindow()
                      handleClose()
                    })
                  }}
                />
              )
          }
          <SaveAsGroup
            triggerText="保存为组"
            confirm={(name, handleClose) => {
              this.props.addGroup(name, this.props.window, handleClose)
            }}
          />
        </MD.ExpansionPanelActions>
      </MD.ExpansionPanel>
    );
  }
}

export default WindowC;
