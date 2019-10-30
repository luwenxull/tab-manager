import uuid from 'uuid/v4'

export function copyTab(tab, newId = true) {
  tab = {
    favIconUrl: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    id: tab.id,
    checked: false,
    // uuid: uuid(),
  }
  tab.uuid = newId ? uuid() : tab.id
  return tab
}