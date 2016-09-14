'use strict';

var qrcode;
var urlArea = document.getElementById('url');

urlArea.addEventListener('blur', function () {
  generateCode();
});
urlArea.addEventListener('keydown', function (e) {
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
  urlArea.value = tabURL;
  urlArea.select();
  // qrcode = new QRCode(document.getElementById('qrcode'), tabURL); // default size 256x256
  qrcode = new QRCode(document.getElementById('qrcode'), { // customized size 128x128
      text: tabURL,
      width: 128,
      height: 128
  });
});

function generateCode() {
  if (!urlArea.value) {
    urlArea.focus();
    return;
  }

  qrcode.makeCode(url.value);
}
