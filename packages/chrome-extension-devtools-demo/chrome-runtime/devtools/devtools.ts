/* eslint-disable no-undef */
const log = (v: any) => {
  chrome.runtime.sendMessage(
    {
      from: 'devtools',
      log: v
    },
    (response) => {
      console.log('Received response', response);
    },
  );
}
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
