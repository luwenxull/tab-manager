import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import TextField from '@material-ui/core/TextField';
import Menu from './Menu.jsx';
import Dialog from './Dialog.jsx'

class Window extends Component {
  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
    this.close = this.closeWindow.bind(this)
    this.updateGroupName = this.updateGroupName.bind(this)
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
          if (this.props.window.notRealWindow) {
            chrome.storage.local.get(['savedGroups'], result => {
              const groups = result.savedGroups.map(group => {
                if (group.id === this.props.group.id) {
                  const newGroup = Object.assign({}, group, {
                    windows: [{
                      tabs: this.props.window.tabs.filter(tab_1 => tab !== tab_1)
                    }]
                  })
                  return newGroup
                }
                return group
              })
              chrome.storage.local.set({
                savedGroups: groups,
              }, close)
            })
          } else {
            chrome.tabs.remove(tab.id)
          }
        }
      }
    ]
    this.groupName = null;
  }

  jump(tab) {
    chrome.tabs.create({
      url: tab.url
    })
  }

  save(close) {
    // TODO validate
    // chrome.storage.local.clear()
    chrome.storage.local.get(['savedGroups'], result => {
      const groups = [].concat(result.savedGroups || [])
      groups.push(
        {
          name: this.groupName,
          id: Date.now(),
          windows: [Object.assign({
            notRealWindow: true
          }, this.props.window)],
        }
      )
      chrome.storage.local.set({
        savedGroups: groups,
      }, close)
    })
  }

  closeWindow() {
    if (this.props.window.notRealWindow) {
      console.log('eeeeeeeeee')
    } else {
      chrome.windows.remove(this.props.window.id)
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
      <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {this.props.window.focused ? "当前窗口" : "其他窗口"}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <List className='full-width'>
            {
              this.props.window.tabs.map(tab => {
                return (
                  <ListItem key={tab.id} dense onClick={() => { this.jump(tab) }}>
                    <ListItemAvatar>
                      <Avatar alt="" src={tab.favIconUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={tab.title} secondary={tab.url} />
                    <ListItemSecondaryAction>
                      <Menu
                        menuItems={this.menuItems}
                        trigger={
                          <IconButton>
                            <MoreVertIcon />
                          </IconButton>
                        }
                        actionData={tab}
                      >
                      </Menu>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })
            }
          </List>
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button color="secondary" onClick={this.closeWindow}>关闭窗口</Button>
          <Dialog
            trigger={
              <Button color="primary">
                保存为组
              </Button>
            }
            render={
              (handleClose) => {
                return (
                  <>
                    <DialogContent>
                      <DialogContentText>
                        将该窗口的所有页面保存为组
                      </DialogContentText>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="组名称"
                        placerholer="请输入组名称"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={this.updateGroupName}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        取消
                      </Button>
                      <Button onClick={() => {
                        this.save(handleClose)
                      }} color="primary">
                        保存
                    </Button>
                    </DialogActions>
                  </>
                )
              }
            }
          >
          </Dialog>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default Window;
