
(function(exports) {
  var MOVE_THRESHOLD = 5;
  var CLICK_INTERVAL = 250;
  var HOLD_INTERVAL = 350;
  var BUTTON_WIDTH = 60;
  var count = 0;
  //Declare Object
  function FxosBanner(stage) {
    this._stage = stage;
    this._sprite = document.createElement('div');
    this._init();
  }
    
  FxosBanner.prototype = {
    _stage: null,
    _sprite: null,

    _init: function() {
      this._render();
      this._registerEvents();
    },
    _render: function() {
      var sprite = this._sprite;
      this._stage.appendChild(sprite);
      sprite.id = 'fxos-banner';
      var left = (screen.width / 2) - 30;
      var style = `
        position: fixed;
        left: ${left}px;
        bottom: 0;
        z-index: 2147483647;
      `;
      sprite.setAttribute('style', style);
      sprite.setAttribute('data-z-index-level', 'fullscreen-layout-software-home-button');
    },
    _registerEvents: function() {
      var sprite = this._sprite;
      var touchPosition;
      var moved = false;
      var timerID;
      var touchStartTimeStamp;
        
      navigator.mozApps.mgmtz.addEventListener('enabledstatechange',
      this._handle_enabledstatechange.bind(this));

      sprite.addEventListener('touchstart', (evt) => {
        var touches = evt.changedTouches;
        touchPosition = {
          'x': touches[0].pageX,
          'y': touches[0].pageY
        };
        sprite.style.backgroundColor = 'rgba(212,168,60,0.9)';
        moved = false;

        touchStartTimeStamp = new Date();
        timerID = setTimeout(() => {
          if(!moved) {
            window.navigator.vibrate(50);
            window.dispatchEvent(new CustomEvent('holdhome'));
          }
        }, HOLD_INTERVAL);
        evt.preventDefault();
      });
      sprite.addEventListener('touchend', () => {
        sprite.style.backgroundColor = 'rgba(60,168,212,0.9)';
        if (moved) {
          //sprite.style.top = touchPosition.y + 'px';
          //sprite.style.left = touchPosition.x + 'px';
          return;
        }
        var time = new Date() - touchStartTimeStamp;
        if(time < CLICK_INTERVAL){
          navigator.vibrate(50);
          window.dispatchEvent(new CustomEvent('home'));
        }
        if (time < HOLD_INTERVAL) {
          clearTimeout(timerID);
          timerID = -1;
        }
      });
      sprite.addEventListener('touchmove', function(evt) {
        var touches = evt.changedTouches;
        var diffX = touchPosition.x - touches[0].pageX
        var diffY = touchPosition.y - touches[0].pageY
        if (Math.abs(diffX) <= MOVE_THRESHOLD &&
            Math.abs(diffY) <= MOVE_THRESHOLD) {
          return;
        }
        touchPosition = {
          'x': touches[0].pageX,
          'y': touches[0].pageY
        };
        moved = true;
        var spriteTop = sprite.offsetTop - diffY;
        var spriteLeft = sprite.offsetLeft - diffX;
        sprite.style.bottom = null;
        //sprite.textContent = spriteTop+"-"+spriteLeft;

        if(spriteTop < 0) spriteTop = 0;
        if(spriteTop > screen.height-BUTTON_WIDTH) spriteTop = screen.height-BUTTON_WIDTH;

        if(spriteLeft < 0) spriteLeft = 0;
        if(spriteLeft > screen.width-BUTTON_WIDTH) spriteLeft = screen.width-BUTTON_WIDTH;

        sprite.style.top = spriteTop + 'px';
        sprite.style.left = spriteLeft + 'px';
        evt.preventDefault();
      });
    }
  }
  
  //Initialize HTML
  var fxosBanner;
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('readystatechange', function() {
      document.readyState === 'interactive' && init();
    });
  }
  function init() {
    var body = document.querySelector('body');
    var number = document.createElement('p');
    number.id = 'count';
    number.textContent = count;
    body.appendChild(number);
    fxosBanner = new FxosBanner(body);
  }
}(window));

