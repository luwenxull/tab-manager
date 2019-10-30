chrome.commands.onCommand.addListener(function(command) {
  console.log(command)
  if(command === "quick-open") {
    chrome.runtime.openOptionsPage()
  }
});