let deferredInstall;
window.addEventListener('beforeinstallprompt', (ev) => {
    ev.preventDefault();
    deferredInstall = ev;
    console.log('saved the install event');
})

const installApp = function () {
    if (deferredInstall) {
        deferredInstall.prompt();
        deferredInstall.userChoice.then((choice) => {
            if (choice.outcome == 'accepted') console.log('app installed');
            else console.log('app rejected');
        })
    }
}
