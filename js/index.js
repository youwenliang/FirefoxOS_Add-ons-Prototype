// If injecting into an app that was already running at the time
// the app was enabled, simply initialize it.
if (document.documentElement) {
  initialize();
}

// Otherwise, we need to wait for the DOM to be ready before
// starting initialization since add-ons are injected
// *before* `document.documentElement` is defined.
else {
  window.addEventListener('DOMContentLoaded', initialize);
}

function initialize() {
  window.onload = addListeners;
  if (document.querySelector('.fxos-banner')) {
    // Already injected, abort.
    return;
  } else {
    var body = document.querySelector('body');
    var fxosBanner = document.createElement('div');
    fxosBanner.classList.add('fxos-banner');
    fxosBanner.id = "dxy";

    body.appendChild(fxosBanner);
      
	fxosBanner.onclick = function() {
      if(fxosBanner.classList.contains('toggle')) {
	    fxosBanner.classList.remove('toggle');
      }
      else {
         fxosBanner.classList.add('toggle');
      }
    }
  }
}

window.onload = addListeners();

function addListeners(){
    document.getElementById('dxy').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp()
{
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    var div = document.getElementById('dxy');
  div.style.position = 'absolute';
  div.style.top = e.clientY-30 + 'px';
  div.style.left = e.clientX-30 + 'px';
}