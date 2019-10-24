import React, { Component } from 'react';
import MD from './conditionalRequre'
import Menu from './components/Menu.jsx';
import SaveAsGroup from './saveAsGroup.jsx'

class WindowC extends Component {
  constructor(props) {
    super(props)
    this.closeTabs = this.closeTabs.bind(this)
    this.updateGroupName = this.updateGroupName.bind(this)
    this.openTabs = this.openTabs.bind(this)
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
        text: this.props.window.isFake ? '移除' : '关闭·',
        action: (tab) => {
          if (this.props.window.isFake) {
            this.props.updateGroup(
              this.props.window.tabs.filter(tab_1 => tab_1 !== tab)
            )
          } else {
            chrome.tabs.remove(tab.id)
          }
        }
      },
      {
        text: '复制到组',
        action: () => {
          
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

  closeTabs() {
    // chrome.windows.remove(this.props.window.id)
    const tabs = this.checked.length ? this.checked : this.props.window.tabs
    chrome.tabs.remove(tabs.map(tab => tab.id))
  }

  openTabs() {
    const tabs = this.checked.length ? this.checked : this.props.window.tabs
    tabs.forEach(tab => {
      chrome.tabs.create({
        url: tab.url
      })
    })
  }

  handleChange(checked, tab) {
    tab.checked = checked
    // if (checked) {
    //   this.checked.push(tab)
    // } else {
    //   const index = this.checked.indexOf(tab)
    //   if (index > -1) {
    //     this.checked.splice(index, 1)
    //   }
    // }
    this.checked = this.props.window.tabs.filter(tab => tab.checked)
    console.log(this.checked)
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
              && <MD.Button color="secondary" onClick={this.closeTabs}>关闭</MD.Button>
          }
          {
            !this.props.window.isFake
              && (
                <SaveAsGroup
                  triggerText="保存为组并关闭"
                  confirm={(name, handleClose) => {
                    this.props.addGroup(name, this.props.window, () => {
                      this.closeTabs()
                      handleClose()
                    })
                  }}
                />
              )
          }
          {
            this.props.window.isFake
              && <MD.Button color="primary" onClick={this.openTabs}>打开</MD.Button>
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
