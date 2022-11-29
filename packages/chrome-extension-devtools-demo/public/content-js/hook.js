console.log(2);

window.map = new Map();
window.index = 0;
function initData() {
  const allDOM = document.querySelector('html');
  const getNode = (node) => {
    const child = [];
    if (node.childNodes) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < node.childNodes.length; i++) {
        const p = node.childNodes[i];

        if (
          p.nodeType === Node.ELEMENT_NODE &&
          p.tagName !== 'META' &&
          p.tagName !== 'g' &&
          p.tagName !== 'path' &&
          p.tagName !== 'LINK' &&
          p.tagName !== 'STYLE' &&
          p.tagName !== 'SCRIPT' &&
          p.tagName !== 'TITLE'
        ) {
          child.push(p.tagName);
          getNode(p);
        }
      }
      window.index++;
      window.map.set(window.index, { tagName: node.tagName, child, node });
    }
  };
  getNode(allDOM);
  return { map: Object.fromEntries(window.map) };
}
function getAllElement() {
  console.log('getAllElement -->');
  return {
    a: 1,
  };
}
function getElement(index) {
  console.log(window.map.get(index).node)
  return window.map.get(index).node
}
window.getAllElement = getAllElement;
window.initData = initData;
window.getElement = getElement;
