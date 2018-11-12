if ('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration){
        console.log('Registration successfull, scope is:',registration.scope);
    })
    .catch(function(error){
        console.log('Registration failed, error:', error);
    });
}
else
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
     registration.unregister()
   } })

/* navigator.serviceWorker.register('/service-worker.js', {
    scope: '/new/'
   }); */

   