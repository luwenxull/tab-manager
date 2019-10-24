export function copyTab(tab) {
  return {
    favIconUrl: tab.favIconUrl,
    title: tab.title,
    url: tab.url,
    id: tab.id,
    checked: false,
  }
}