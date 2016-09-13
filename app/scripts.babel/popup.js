'use strict';

var qrcode;
var urlInput = document.getElementById('url');
urlInput.addEventListener('blur', function () {
  generateCode();
});
urlInput.addEventListener('keydown', function (e) {
  if (e.keyCode == 13) {
    generateCode();
  }
});

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function (tabs) {
  var tabURL = tabs[0].url;
  // console.log(tabURL);
  document.getElementById('url').value = tabURL;
  qrcode = new QRCode(document.getElementById('qrcode'), tabURL);
});

function generateCode() {
  var url = document.getElementById('url');

  if (!url.value) {
    url.focus();
    return;
  }

  qrcode.makeCode(url.value);
}
