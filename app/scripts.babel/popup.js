'use strict';

var qrcode;
var urlArea = document.getElementById('url');

urlArea.addEventListener('blur', function () { // listen to 'blur' event, a 'tab' will do
  generateCode();
});
// urlArea.addEventListener('keydown', function (e) {
//   if (e.keyCode == 13) {
//     generateCode();
//   }
// });

chrome.tabs.query({
  active: true,
  currentWindow: true
}, function (tabs) {
  var tabURL = tabs[0].url;
  // console.log(tabURL);

  // if it's localhost(127.0.0.1), replace it with local ip, e.g. 192.168.x.x
  var anchor = document.createElement('a');
  anchor.href = tabURL;
  if (anchor.hostname == 'localhost' || anchor.hostname == '127.0.0.1') {
    getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
      anchor.hostname = ips[0];
      tabURL = anchor.href;
      generateCode(tabURL);
    });
  } else { // and yes, those two tabURLs are different
    generateCode(tabURL);
  }
});

function generateCode(tabURL) {
  urlArea.value = tabURL;
  urlArea.select();
  // qrcode = new QRCode(document.getElementById('qrcode'), tabURL); // default size 256x256
  qrcode = new QRCode(document.getElementById('qrcode'), { // customized size 128x128
      text: tabURL,
      width: 128,
      height: 128
  });

  if (!urlArea.value) {
    urlArea.focus();
    return;
  }

  qrcode.makeCode(url.value);
}

function updateIP(anchor, ips, tabURL) {
  anchor.hostname = ips[0];
  tabURL = anchor.href;
}

function getLocalIPs(callback) {
  var ips = [];

  var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

  var pc = new RTCPeerConnection({
    // Don't specify any stun/turn servers, otherwise you will
    // also find your public IP addresses.
    iceServers: []
  });
  // Add a media line, this is needed to activate candidate gathering.
  pc.createDataChannel('');
  
  // onicecandidate is triggered whenever a candidate has been found.
  pc.onicecandidate = function(e) {
    if (!e.candidate) { // Candidate gathering completed.
      pc.close();
      callback(ips);
      return;
    }
    var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
    if (ips.indexOf(ip) == -1) {// avoid duplicate entries (tcp/udp)
        ips.push(ip);
    }
  };
  pc.createOffer(function(sdp) {
    pc.setLocalDescription(sdp);
  }, function onerror() {});
}
