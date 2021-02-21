self.addEventListener('fetch', event=> {
    let response=fetch(event.request);
    event.respondWith(response);
  });