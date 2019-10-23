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
import Menu from './Menu.jsx';

class Window extends Component {
  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
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
        text: '关闭',
        action: (tab) => {
          chrome.tabs.remove(tab.id)
        }
      }
    ]
  }

  jump(tab) {
    chrome.tabs.create({
      url: tab.url
    })
  }

  save() {

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
                        trigger={<Button>操作</Button>}
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
          {/* <Buttonall">Cancel</Button> */}
          <Button color="primary" onClick={this.save}>
            保存为组
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default Window;
