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
  // qrcode = new QRCode(document.getElementById('qrcode'), tabURL);
  qrcode = new QRCode(document.getElementById('qrcode'), {
      text: tabURL,
      width: 128,
      height: 128
  });
});

function generateCode() {
  var urlArea = document.getElementById('url');

  if (!urlArea.value) {
    // urlArea.focus();
    return;
  }

  qrcode.makeCode(url.value);
}
