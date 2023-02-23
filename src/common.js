

//https://stackoverflow.com/questions/10309650/add-elements-to-the-dom-given-plain-text-html-using-only-pure-javascript-no-jqu
//lets me add elements without fucking up listeners
function appendHtml(el, str) {
  var div = document.createElement('div');
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}