/* FreeLLMAPI PWA bootstrap: registers the service worker and offers a
 * dismissible "Install app" button when Android/Chrome fires
 * beforeinstallprompt. Loaded as a plain external script (no inline code, so
 * the server's CSP stays happy). Does nothing when already installed.
 */
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {
        /* PWA offline support is best-effort; the dashboard still works. */
      });
    });
  }

  var isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isStandalone) return;

  var DISMISS_KEY = 'freellmapi.installDismissedAt';
  var deferredPrompt = null;

  function recentlyDismissed() {
    try {
      var at = Number(localStorage.getItem(DISMISS_KEY) || 0);
      return Date.now() - at < 7 * 24 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  }

  function showInstallButton() {
    if (!deferredPrompt || recentlyDismissed() || document.getElementById('freellmapi-install')) return;

    var bar = document.createElement('div');
    bar.id = 'freellmapi-install';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Install FreeLLMAPI');
    bar.style.cssText = [
      'position:fixed', 'left:50%', 'transform:translateX(-50%)',
      'bottom:calc(16px + env(safe-area-inset-bottom))', 'z-index:9999',
      'display:flex', 'align-items:center', 'gap:10px',
      'background:#18181b', 'color:#fafafa', 'border:1px solid #3f3f46',
      'border-radius:999px', 'padding:8px 8px 8px 16px',
      'box-shadow:0 8px 30px rgba(0,0,0,.45)',
      'font:500 14px system-ui,-apple-system,sans-serif',
      'max-width:calc(100vw - 32px)',
    ].join(';');

    var label = document.createElement('span');
    label.textContent = 'Install FreeLLMAPI as an app';

    var installBtn = document.createElement('button');
    installBtn.type = 'button';
    installBtn.textContent = 'Install';
    installBtn.style.cssText = [
      'background:#fafafa', 'color:#09090b', 'border:0', 'border-radius:999px',
      'padding:8px 16px', 'font:600 14px system-ui,-apple-system,sans-serif', 'cursor:pointer',
    ].join(';');
    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        bar.remove();
      });
    });

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', 'Dismiss install prompt');
    closeBtn.style.cssText = [
      'background:transparent', 'color:#a1a1aa', 'border:0', 'border-radius:999px',
      'width:32px', 'height:32px', 'font-size:18px', 'line-height:1', 'cursor:pointer',
    ].join(';');
    closeBtn.addEventListener('click', function () {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* ignore */ }
      bar.remove();
    });

    bar.appendChild(label);
    bar.appendChild(installBtn);
    bar.appendChild(closeBtn);
    document.body.appendChild(bar);
  }

  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    deferredPrompt = event;
    showInstallButton();
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    var bar = document.getElementById('freellmapi-install');
    if (bar) bar.remove();
  });
})();
