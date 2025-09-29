
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        //console.log('Le script print.js est chargé addEventListener.');
        const p = document.querySelector('main p');
console.log(window.getComputedStyle(p).hyphens);
console.log(window.getComputedStyle(p).wordBreak);
    });
} else {
    // DOM déjà chargé
    //console.log('Le script print.js est chargé. DOM déjà chargé');
    
}
