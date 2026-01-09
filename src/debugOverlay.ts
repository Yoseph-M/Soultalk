
function showErrorOverlay(message: string) {
  let el = document.getElementById('app-error-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'app-error-overlay';
    Object.assign(el.style, {
      position: 'fixed',
      left: '0',
      right: '0',
      top: '0',
      bottom: '0',
      background: 'rgba(0,0,0,0.85)',
      color: 'white',
      padding: '20px',
      zIndex: '999999',
      overflow: 'auto',
      fontFamily: 'monospace',
      whiteSpace: 'pre-wrap',
    });
    document.body.appendChild(el);
  }
  (el as HTMLElement).textContent = message;
}

window.addEventListener('error', (ev: ErrorEvent) => {
  const err = ev.error || ev.message || String(ev);
  showErrorOverlay('Uncaught error:\n\n' + (err && (err as any).stack ? (err as any).stack : String(err)));
});

window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => {
  const reason = ev.reason;
  showErrorOverlay('Unhandled Rejection:\n\n' + (reason && reason.stack ? reason.stack : JSON.stringify(reason)));
});

export {};
