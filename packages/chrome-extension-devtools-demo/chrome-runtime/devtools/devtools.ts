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
      panel.onShown.addListener(() => {
        chrome.runtime.sendMessage(
          {
            from: 'create',
          }
        );
      })
    }
);
chrome.devtools.panels.elements.createSidebarPane("Custom Properties",
  (sidebar) => {
    sidebar.setPage("sidebar.html");
    sidebar.setHeight('100px')
  }
);
