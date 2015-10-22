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
    
    var stage = 0;
    
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
            container.className = "container origin";
            
            container.appendChild(background);
            this.stage.appendChild(container);
            
            this.menu = new MenuOptions(container);
	          var menu = this.menu;
            menu.addItem('top', '1');
            menu.addItem('back', '2');
            menu.addItem('home', '3');

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
            var mouseover = false;
            
            //Touch Start
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
                      stage = 1;
                  }
                }, HOLD_INTERVAL);
            });
            //Touch End
            button.addEventListener('touchend', (evt) => {
                var time = new Date() - touchStartTimeStamp;
                this.container.classList.remove('move');
				          evt.target.className = "circle";
                background.className = "circle background";
                this.menu.close();
                stage = 0;
                clearTimeout(timerID);
                timerID = -1;
            });
            
             //Touch Move
             var body = document.querySelector('body');
	 		 body.addEventListener('touchmove', (evt) => {
                 var xpos = evt.touches[0].clientX;
                 var ypos = evt.touches[0].clientY;
                 var dist = Math.sqrt(Math.pow(xpos-39,2)+Math.pow(ypos-330,2));
                 
                 if(dist < 39 && !mouseover) {
                     mouseover = true;
                     console.log("mouseover");
                     if(stage == 1){
                     	button.classList.add('hovering');
                 	}
                 }
                 else if(dist > 39 && mouseover) {
                     mouseover = false;
                     console.log("mouseout");
                     if(stage == 1){
                     	button.classList.remove('hovering');
                 	}
                 }
             });            

        }
    }
    function MenuOptions(container){
    	this.container = container;
        this.items = [];
        this.startAngle = 0;
        this.addAngle = 0;
        this.renderIndex = 0;
        this._xpos = [];
        this._ypos = [];
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
                'classLists': classLists || [],
                'index': "0"
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
            this.items.forEach(this.registerEvents.bind(this));
		},
        renderItem: function(item) {
            if(this.renderedCount<3){
              this.startAngle = 180/(this.renderedCount+1)-90;
              this.addAngle = 180/(this.renderedCount+1);
            } else {
              this.startAngle = -90;
              this.addAngle = 180/(this.renderedCount-1);
            }
            var menu = document.createElement('div');	
            menu.role = 'menu';
            menu.classList.add('circle-item');
            menu.classList.add('origin');
            item.classLists.forEach((cls) => {
              menu.classList.add(cls);
            });
            menu.id = item.id;
            this.container.appendChild(menu);
            item.index = this.renderIndex;
            
            this._xpos[this.renderIndex] = 175*Math.cos((Math.PI/180)*(this.startAngle+this.renderIndex*this.addAngle));
            this._ypos[this.renderIndex] = 175*Math.sin((Math.PI/180)*(this.startAngle+this.renderIndex*this.addAngle));
            menu.style.transform = "translate3d("+this._xpos[this.renderIndex]+"px, "+this._ypos[this.renderIndex]+"px, 0)";
            menu.style.transitionDelay = 150+100*this.renderIndex+"ms";
            this.renderIndex++;
        },
        open: function(){
            console.log("open");
            setTimeout(() => {
            this.container.classList.remove('origin');
                setTimeout(() => {
  	            this.container.classList.add('open');
	          }, 350);
          }, 50);
        },
        close: function(){
            console.log("close");
            setTimeout(() => {
  	            this.container.classList.remove('open');
	        }, 350);
            this.container.classList.add('origin');
        },
        registerEvents: function(item){
            //Touch Move
             var mouseover = false;
             var currentId = -1;
             var body = document.querySelector('body');
	 		 body.addEventListener('touchmove', (evt) => {
                 var xpos = evt.touches[0].clientX;
                 var ypos = evt.touches[0].clientY;
                 var _x = parseInt(this._xpos[item.index])+39;
                 var _y = parseInt(this._ypos[item.index])+330;
                 var dist = Math.sqrt(Math.pow(xpos-_x,2)+Math.pow(ypos-_y,2));
                 
                 if(dist < 39 && !mouseover) {
                     console.log("mouseover");
                     if(stage == 1){
                                              mouseover = true;
                     	document.getElementById(item.id).className +=' hovering';
                        document.getElementById(item.id).style.transform += " scale3d(1.3,1.3,1.3)";
                        currentId = item.id;
                 	}
                 }
                 else if(dist > 39 && mouseover) {

                     console.log("mouseout");
                     if(stage == 1){
                                              mouseover = false;
                     	document.getElementById(item.id).className = document.getElementById(item.id).className.split('hover')[0];
                        document.getElementById(item.id).style.transform = document.getElementById(item.id).style.transform.split('scale')[0];
                        currentId = -1;
                 	}
                 }
             });
             body.addEventListener('touchend', (evt) => {
                 if(mouseover){
                     console.log(currentId);
                     navigator.vibrate(50);
                     window.dispatchEvent(new CustomEvent(currentId));
                     setTimeout(function(){
                         document.getElementById(currentId).className = document.getElementById(currentId).className.split('hover')[0];
                         document.getElementById(currentId).style.transform = document.getElementById(currentId).style.transform.split('scale')[0];
                         currentId = -1;
                         mouseover = false;
                     },100);
                 }
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