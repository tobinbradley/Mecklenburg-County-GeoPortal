let newWorker

// Register service worker and show update notice if new content
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      // An updated service worker has appeared in reg.installing!
      newWorker = reg.installing;

      newWorker.addEventListener('statechange', () => {
        // Has service worker state changed?
        switch (newWorker.state) {
          case 'installed':
            // There is a new service worker available, show the notification
            if (navigator.serviceWorker.controller) {
              console.log('New content is available, please refresh.')
              newWorker.postMessage({ type: 'SKIP_WAITING' })
              const dialog = document.querySelector("#sw-dialog")
              if (dialog) dialog.showModal()
            }
            break;
        }
      });
    });
  });
}
