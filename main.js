import sodium from 'https://cdn.jsdelivr.net/npm/libsodium-wrappers@0.7.9/+esm';
await sodium.ready;

function genKeys() {
  const stored = localStorage.getItem('keys');
  if (stored) return JSON.parse(stored);
  const keyPair = sodium.crypto_box_keypair();
  const keys = {
    publicKey: sodium.to_base64(keyPair.publicKey),
    secretKey: sodium.to_base64(keyPair.privateKey)
  };
  localStorage.setItem('keys', JSON.stringify(keys));
  return keys;
}

const keys = genKeys();
const myPublicKey = sodium.from_base64(keys.publicKey);
const mySecretKey = sodium.from_base64(keys.secretKey);
let remotePublicKey;
let sharedKey;
let peer;

const nameInput = document.getElementById('name');
const createBtn = document.getElementById('createBtn');
const inviteLink = document.getElementById('inviteLink');
const answerInput = document.getElementById('answerInput');
const useAnswerBtn = document.getElementById('useAnswer');
const answerSection = document.getElementById('answerSection');
const answerText = document.getElementById('answerText');
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const clearHistoryBtn = document.getElementById('clearHistory');
const messages = document.getElementById('messages');

loadHistory();

function appendMessage(sender, text, time = Date.now(), save = true) {
  const div = document.createElement('div');
  const ts = new Date(time).toLocaleTimeString();
  div.textContent = `[${ts}] ${sender}: ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  if (save) {
    const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
    history.push({ sender, text, time });
    localStorage.setItem('chatHistory', JSON.stringify(history));
  }
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('chatHistory') || '[]');
  history.forEach(msg => appendMessage(msg.sender, msg.text, msg.time, false));
}

function encrypt(msg) {
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const cipher = sodium.crypto_secretbox_easy(sodium.from_string(msg), nonce, sharedKey);
  return JSON.stringify({ n: sodium.to_base64(nonce), c: sodium.to_base64(cipher) });
}

function decrypt(payload) {
  const data = JSON.parse(payload);
  const msg = sodium.crypto_secretbox_open_easy(
    sodium.from_base64(data.c),
    sodium.from_base64(data.n),
    sharedKey
  );
  return sodium.to_string(msg);
}

function startHost() {
  peer = new SimplePeer({ initiator: true, trickle: false, config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] } });
  peer.on('signal', offer => {
    const linkData = { offer, key: keys.publicKey, name: nameInput.value || 'user' };
    const link = location.origin + location.pathname + '#' + btoa(JSON.stringify(linkData));
    inviteLink.value = link;
    document.getElementById('invite').style.display = 'block';
  });
  peer.on('connect', () => {
    sharedKey = sodium.crypto_box_beforenm(remotePublicKey, mySecretKey);
    document.getElementById('chat').style.display = 'block';
    appendMessage('System', 'Соединение установлено');
  });
  peer.on('data', data => {
    const msg = decrypt(data);
    appendMessage('Друг', msg);
  });
}

function startGuest(remote) {
  peer = new SimplePeer({ initiator: false, trickle: false, config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] } });
  peer.on('signal', answer => {
    const resp = { answer, key: keys.publicKey, name: nameInput.value || 'user' };
    answerText.value = btoa(JSON.stringify(resp));
    answerSection.style.display = 'block';
  });
  peer.on('connect', () => {
    sharedKey = sodium.crypto_box_beforenm(remotePublicKey, mySecretKey);
    document.getElementById('chat').style.display = 'block';
    appendMessage('System', 'Соединение установлено');
  });
  peer.on('data', data => {
    const msg = decrypt(data);
    appendMessage('Друг', msg);
  });
  peer.signal(remote.offer);
}

createBtn.onclick = startHost;

useAnswerBtn.onclick = () => {
  const payload = JSON.parse(atob(answerInput.value.trim()));
  remotePublicKey = sodium.from_base64(payload.key);
  peer.signal(payload.answer);
};

sendBtn.onclick = () => {
  const msg = msgInput.value;
  if (!msg) return;
  peer.send(encrypt(msg));
  appendMessage('Вы', msg);
  msgInput.value = '';
};

clearHistoryBtn.onclick = () => {
  localStorage.removeItem('chatHistory');
  messages.innerHTML = '';
};

if (location.hash) {
  const payload = JSON.parse(atob(location.hash.substring(1)));
  remotePublicKey = sodium.from_base64(payload.key);
  startGuest(payload);
}
