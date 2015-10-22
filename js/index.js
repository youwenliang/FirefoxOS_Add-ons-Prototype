(function() {
    function FloatButton(stage){
    this.stage = stage;
        this.button = document.createElement("div");
        this.container = document.createElement("div");
        this.init();
    }
    
    var CLICK_INTERVAL = 250;
  	var HOLD_INTERVAL = 350;
	var MOVE_THRESHOLD = 5;
    
    FloatButton.prototype = {
        container: null,
        button: null,
        
        init: function(){
            this.render();
            this.registerEvents();
        },
        
        render: function(){
            var button = this.button;
          	var container = this.container;
          	button.id = "button";
      		button.className = "circle";
            container.className = "container";
          	container.appendChild(button);
            this.stage.appendChild(container);
        },
        registerEvents: function(){
        	var button = this.button;
            var timerID;
            var touchStartTimeStamp;
            var touchPosition;
            var moved = false;
            var longPressed = false;
            
            button.addEventListener('touchstart', (evt) => {
                longPressed = false;
                touchStartTimeStamp = new Date();
                evt.target.className += " move";
                timerID = setTimeout(() => {
                  if (! moved) {
                      navigator.vibrate(50);
                      evt.target.className += " hovering";
                      longPressed = true;
                  }
                }, HOLD_INTERVAL);
            });
            button.addEventListener('touchend', (evt) => {
                var time = new Date() - touchStartTimeStamp;
 				  evt.target.className = "circle";               
                  clearTimeout(timerID);
                  timerID = -1;
                
            });
      	}
    }

    
  // If injecting into an app that was already running at the time
  // the app was enabled, simply initialize it.  
    var floatButton;
      //Initialize HTML
    if (document.readyState !== 'loading') {
      init();
    } else {
      document.addEventListener('readystatechange', function() {
        document.readyState === 'interactive' && init();
      });
    }

    function init() {
        var body = document.querySelector('body');
        floatButton = new FloatButton(body);
    }
})(window);