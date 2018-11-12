// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'damar-mws-data-v1';
var cacheName = 'damar-mws-cache-v1';
var filesToCache = [
    '/',
    'index.html',
    '404.html',
    '/style/inline2.css',
    '/images/ham.png',
    '/images/planB2.png',
    '/images/warkop.jpg',
    '/images/ikan_bakar.jpg',
    '/images/steak.jpg',
    '/images/seafood.jpg',
    '/images/menu.png',
    '/images/photo.png',
    '/script/map.js',
    '/script/fetchjson.js',
    '/project1/add2numbers.html',
    '/project1/add2numbers.js',
    '/project2/map.html',
    '/project3/fetchjson.html',
    'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
    .then( function(){
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);  
  e.respondWith(
    fetch(e.request).then( function(response){
      let responseClone = response.clone();
      caches.open(cacheName)
      .then( function(cache) {
        cache.put(e.request, responseClone);
      })
      return response;
    })
    .catch( function() {
      return caches.match(e.request);
      /* 2nd level callback
      .then( function(response) {
        return response || caches.match(offileUrl); 
      })*/

    })

    /*
	  caches.match(e.request).then(function(response) {
	    return response || fetch(e.request);
	  })*/
  );
});

/* navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
   registration.unregister()
 } }) */
