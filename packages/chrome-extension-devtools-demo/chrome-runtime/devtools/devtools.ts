/* eslint-disable no-undef */
chrome.devtools.panels.create("Custom Panel",
    "",
    "devtools-panel.html",
    (panel) => {
      // code invoked on panel creation
      console.log(panel)
    }
);
chrome.devtools.panels.elements.createSidebarPane("Custom Properties",
  (sidebar) => {
    console.log(sidebar)
    sidebar.setPage("sidebar.html");
    sidebar.setHeight('100px')
  }
);
// Create a connection to the background service worker
const backgroundPageConnection = chrome.runtime.connect({
  name: "devtools-page"
});

// Relay the tab ID to the background service worker
backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});