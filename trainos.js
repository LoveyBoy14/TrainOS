document.addEventListener('DOMContentLoaded', function() {
  const home = document.getElementById('home-screen');
  const games = document.getElementById('games-screen');
  const apps = document.getElementById('apps-screen');
  const proxy = document.getElementById('proxy-screen');


  document.getElementById('games-button').addEventListener('click', function() {
    window.loadThen(function() {
      home.classList.add('screen-hidden');
      games.classList.remove('screen-hidden');
    });
  });

  document.getElementById('apps-button').addEventListener('click', function() {
    window.loadThen(function() {
      home.classList.add('screen-hidden');
      apps.classList.remove('screen-hidden');
    });
  });

 
  document.getElementById('proxy-button').addEventListener('click', function() {
    window.loadThen(function() {
      home.classList.add('screen-hidden');
      proxy.classList.remove('screen-hidden');
      
   
      triggerProxyLaunch();
    });
  });

  const backButtons = document.querySelectorAll('.back-button');

  backButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      games.classList.add('screen-hidden');
      apps.classList.add('screen-hidden');
      proxy.classList.add('screen-hidden');
      home.classList.remove('screen-hidden');
    });
  });
  function triggerProxyLaunch() {
    const proxyBtn = document.getElementById('proxy-button');
    proxyBtn.disabled = true;
    proxyBtn.textContent = 'Starting Scramjet...';

    fetch('/run-proxy')
        .then(response => response.text())
        .then(data => {
            console.log(data);
            proxyBtn.disabled = false;
            proxyBtn.textContent = 'Proxy';
        })
        .catch(err => {
            console.error('Failed to connect to local server backend:', err);
            proxyBtn.disabled = false;
            proxyBtn.textContent = 'Proxy (Offline)';
        });
  }

 
  Lumin.init({
    container: '#games',
    theme: 'dark'
  });
});


const loadingMessages = [
  "im stuck in the basement help me",
  "i like trains",
  "Will she say yes?",
  ".",
  "How many of these do I have to make",
  "I am a loading screen",
  "can I stop writing these yet?",
  "dododoodododododododododododododododododo",
  "sghdfkjgdhfugydugkdjfhgdjfhgdjkfhgdfkjghdkhgkdjfghdfugudfgudfgyuidfhkjdhgkjdfiudig",
  "last one?"
];

let loadingInterval = null;

function ensureLoadingScreenExists() {
  let overlay = document.getElementById("loading-screen");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "loading-screen";
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    const txt = document.createElement("div");
    txt.id = "loading-text";
    
    overlay.appendChild(spinner);
    overlay.appendChild(txt);
    document.body.prepend(overlay);
    
    overlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background-color:rgba(18,18,18,0.98); color:#ffffff; display:none; flex-direction:column; justify-content:center; align-items:center; z-index:9999999; opacity:0; transition:opacity 0.3s ease-in-out; font-family:sans-serif;";
    txt.style.cssText = "font-size:1.3rem; font-weight:bold;";
    
    if (!document.getElementById("loading-spinner-keyframes")) {
      const styleSheet = document.createElement("style");
      styleSheet.id = "loading-spinner-keyframes";
      styleSheet.innerText = `
        .loading-spinner { width:60px; height:60px; border:5px solid #2a2a2a; border-top:5px solid #3498db; border-radius:50%; animation:loading-spin 1s linear infinite; margin-bottom:25px; }
        @keyframes loading-spin { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
      `;
      document.head.appendChild(styleSheet);
    }
  }
  return overlay;
}

window.loadThen = function(screenSwitchAction) {
  const overlay = ensureLoadingScreenExists();
  const txt = document.getElementById("loading-text");
  
  txt.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  
  overlay.style.display = "flex";
  overlay.offsetHeight; 
  overlay.style.opacity = "1";

  if (loadingInterval) clearInterval(loadingInterval);
  loadingInterval = setInterval(() => {
    txt.textContent = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }, 5000);

  setTimeout(() => {
    if (typeof screenSwitchAction === "function") {
      screenSwitchAction();
    }

    clearInterval(loadingInterval);
    overlay.style.opacity = "0";
    
    setTimeout(() => {
      if (overlay.style.opacity === "0") {
        overlay.style.display = "none";
      }
    }, 300);

  }, 5000); 
};
