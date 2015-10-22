(function() {
    function FloatButton(stage){
    	this.stage = stage;
        this.button = document.createElement("div");
        this.container = document.createElement("div");
        this.background = document.createElement("div");
        this.init();
    }
    
    var CLICK_INTERVAL = 250;
  	var HOLD_INTERVAL = 350;
	var MOVE_THRESHOLD = 5;
    
    FloatButton.prototype = {
        container: null,
        button: null,
        background: null,
        
        init: function(){
            this.render();
            this.registerEvents();
        },
        
        render: function(){
            var button = this.button;
          	var container = this.container;
            var background = this.background;
            
          	button.id = "button";
      		button.className = "circle";
            background.id = "background";
            background.className = "circle background";
            container.className = "container";
            
            container.appendChild(background);
            this.stage.appendChild(container);
            
            this.menu = new MenuOptions(container);
	        var menu = this.menu;
            menu.addItem('top', '');
            menu.addItem('back', '');
            menu.addItem('home', '');
            menu.render();
           	container.appendChild(button);
        },
        registerEvents: function(){
        	var button = this.button;
            var background = this.background;
            var timerID;
            var touchStartTimeStamp;
            var touchPosition;
            var moved = false;
            var longPressed = false;
            
            button.addEventListener('touchstart', (evt) => {
                longPressed = false;
                touchStartTimeStamp = new Date();
                evt.target.className += " hovering";
                this.container.classList.add('move');
                timerID = setTimeout(() => {
                  if (! moved) {
                      navigator.vibrate(50);
                      background.className += " scale";
                      longPressed = true;
                      this.menu.open();
                  }
                }, HOLD_INTERVAL);
            });
            button.addEventListener('touchend', (evt) => {
                var time = new Date() - touchStartTimeStamp;
                  this.container.classList.remove('move');
 				  evt.target.className = "circle";
                  background.className = "circle background";
                  this.menu.close();
                  clearTimeout(timerID);
                  timerID = -1;
                
            });
      	}
    }
    function MenuOptions(container){
    	this.container = container;
        this.items = [];
    }
    
    Object.defineProperty(MenuOptions.prototype, 'opened', {
	    get: function() {
      		return this.container.classList.contains('opened');
    	}
  	});
    
    MenuOptions.prototype = {
        addItem: function(id, text, classLists){
            this.items.push({
                'id': id,
                'text': text,
                'classLists': classLists || []
            });
        },
        removeItem: function(id) {
            for (var i = 0; i < this.items.length; i++) {
              if (this.items[i].id === id) {
                this.items.splice(i, 1);
                break;
              }
            }
        },
        render: function(){
            this.renderedCount = this.items.length;
    		this.items.forEach(this.renderItem.bind(this));
		},
        renderItem: function(item) {
            var menu = document.createElement('div');	
            menu.role = 'menu';
            menu.classList.add('circle-item');
            item.classLists.forEach((cls) => {
              menu.classList.add(cls);
            });
            menu.id = item.id;
            this.container.appendChild(menu);
        },
        open: function(){
            console.log("open");
            setTimeout(() => {
            this.container.classList.add('open');
          }, 50);
        },
        close: function(){
            console.log("close");
            this.container.classList.remove('open');
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