/* eslint-disable no-undef */
chrome.devtools.panels.create("Custom Panel",
    "MyPanelIcon.png",
    "devtools-panel.html",
    (panel) => {
      // code invoked on panel creation
      console.log(panel)
    }
);
chrome.devtools.panels.elements.createSidebarPane("Custom Properties",
  (sidebar) => {
    sidebar.setPage("sidebar.html");
    sidebar.setHeight("8ex");
  }
);