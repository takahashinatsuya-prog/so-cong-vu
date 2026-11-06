/* App Xem nhanh: giữ sẵn khung trang trong máy để mở tức thì (số liệu vẫn tải mới từ Google mỗi lần). Đổi BAN khi phát hành bản mới. */
var BAN='xn-app-5',VO=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(BAN).then(function(c){return c.addAll(VO);}).then(function(){return self.skipWaiting();}));});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==BAN&&k.indexOf('xn-font')!==0;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);if(e.request.method!=='GET')return;
  if(u.origin===location.origin){                                   // khung trang: lấy trong máy ngay, đồng thời cập nhật ngầm
    e.respondWith(caches.open(BAN).then(function(c){return c.match(e.request,{ignoreSearch:true}).then(function(r){
      var moi=fetch(e.request).then(function(x){if(x&&x.ok)c.put(e.request,x.clone());return x;}).catch(function(){return r;});
      return r||moi;});}));
  }else if(u.host==='fonts.googleapis.com'||u.host==='fonts.gstatic.com'){   // phông: giữ lâu
    e.respondWith(caches.open('xn-font-1').then(function(c){return c.match(e.request).then(function(r){return r||fetch(e.request).then(function(x){if(x&&(x.ok||x.type==='opaque'))c.put(e.request,x.clone());return x;});});}));
  }                                                                  // script.google.com (số liệu): để mạng xử lý, không giữ
});
