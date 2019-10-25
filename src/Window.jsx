import React, { Component } from 'react';
import MD from './conditionalRequre'
import Menu from './components/Menu.jsx';
// import Dialog from './components/Dialog.jsx'
import SaveAsGroup from './SaveAsGroup.jsx'
import SendToGroup from './SendToGroup.jsx'
import { SavedGroupsContext } from './context';

export default class WindowC extends Component {
  constructor(props) {
    super(props)
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
        action: (tab) => {
          this.setState({
            showSendToGroup: true,
            activeTabs: [tab],
          })
        }
      }
    ]
    this.groupName = null;
    this.state = {
      showSendToGroup: false,
      activeTabs: [],
    }
    this.closeTabs = this.closeTabs.bind(this)
    this.openTabs = this.openTabs.bind(this)
    this.closeSendToGroup = this.closeSendToGroup.bind(this)
    this.showSendToGroup = this.showSendToGroup.bind(this)
    this.handleSendToGroup = this.handleSendToGroup.bind(this)
    this.handleSaveAsGroup = this.handleSaveAsGroup.bind(this)
    this.handleSaveAsGroupAndClose = this.handleSaveAsGroupAndClose.bind(this)
  }

  get tabs() {
    const tabs = this.props.window.tabs.filter(tab => tab.checked)
    return tabs.length ? tabs : this.props.window.tabs
  }

  closeSendToGroup() {
    this.setState({
      showSendToGroup: false
    })
  }

  jump(tab) {
    chrome.tabs.create({
      url: tab.url
    })
  }

  closeTabs() {
    if (this.props.window.isFake) {
      this.props.updateGroup(
        this.props.window.tabs.filter(tab => this.tabs.indexOf(tab) === -1)
      )
    } else {
      chrome.tabs.remove(this.tabs.map(tab => tab.id))
    }
  }

  openTabs() {
    this.tabs.forEach(tab => {
      chrome.tabs.create({
        url: tab.url
      })
    })
  }

  handleChange(checked, tab) {
    tab.checked = checked
  }

  showSendToGroup() {
    this.setState({
      showSendToGroup: true,
      activeTabs: this.tabs,
    })
  }

  handleSendToGroup(groups) {
    groups.forEach(group => {
      group.window.tabs = group.window.tabs.concat(this.state.activeTabs)
    })
    chrome.storage.local.set({
      savedGroups: this.context
    })
    this.closeSendToGroup()
  }

  handleSaveAsGroup(name, handleClose) {
    this.props.addGroup(name, this.tabs, handleClose)
  }

  handleSaveAsGroupAndClose(name, handleClose) {
    this.props.addGroup(name, this.tabs, () => {
      this.closeTabs()
      handleClose()
    })
  }

  render() {
    if (this.props.window.tabs.length === 0) {
      return null
    }
    return (
      <>
        <MD.ExpansionPanel defaultExpanded>
          <MD.ExpansionPanelSummary expandIcon={<MD.ExpandMoreIcon />}>
            {this.props.window.focused ? "当前窗口" : "其他窗口"}
          </MD.ExpansionPanelSummary>
          <MD.ExpansionPanelDetails>
            <MD.List className='full-width'>
              {
                this.props.window.tabs.map(tab => {
                  return (
                    <MD.ListItem key={tab.uuid} dense>
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
            <MD.Button color="secondary" onClick={this.closeTabs}>
              {
                this.props.window.isFake ? '移除' : '关闭'
              }
            </MD.Button>
            <MD.Button color="primary" onClick={this.showSendToGroup}>
              复制到组
            </MD.Button>
            {
              !this.props.window.isFake
                && (
                  <SaveAsGroup
                    triggerText="保存为组并关闭"
                    confirm={this.handleSaveAsGroupAndClose}
                  />
                )
            }
            {
              this.props.window.isFake
                && <MD.Button color="primary" onClick={this.openTabs}>打开</MD.Button>
            }
            <SaveAsGroup
              triggerText="保存为组"
              confirm={this.handleSaveAsGroup}
            />
          </MD.ExpansionPanelActions>
        </MD.ExpansionPanel>
        <SendToGroup
          from={this.props.group}
          open={this.state.showSendToGroup}
          handleClose={this.closeSendToGroup}
          handleSave={this.handleSendToGroup}
        />
      </>
    );
  }
}

WindowC.contextType = SavedGroupsContext
