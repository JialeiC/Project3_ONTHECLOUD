(function() {

    var imageResources = getImageRes();
    my.ImageManager.load(imageResources, loadImageResources);

    
    function loadImageResources(number) {
        my.DOM.get('progressText').innerHTML = 'Loading image...(' + ~~(number / imageResources.length * 100) + '%)';
        if(number < imageResources.length) {
            return false;
        }

        if(!buzz.isOGGSupported() && !buzz.isMP3Supported()) {
            my.DOM.remove(my.DOM.get('progressText'));
            init();
        } else {
            loadAudioResources();
        }
    }

    
    function loadAudioResources(number) {
        var res = getAudioRes(), len = res.length;
        var group = [], item, a;

        for(var i = 0; i < len; i++) {
            item = res[i];
            a = new buzz.sound(item.src, {
                formats : ['wav', 'mp3'],
                preload : true,
                autoload : true,
                loop : !!item.loop
            });

            group.push(a);
            Audio.list[item.id] = a;
        }

        var buzzGroup = new buzz.group(group);
        var number = 1;

        buzzGroup.bind('loadeddata', function(e) {
            my.DOM.get('progressText').innerHTML = 'Loading music...(' + ~~(number / len * 100) + '%)';

            if(number >= len) {
                my.DOM.remove(my.DOM.get('progressText'));
                init();
            } else {
                number++;
            }
        });
    }

    
    function init() {
        Audio.play('ogg_background');

 
        var donkeyJump = new DonkeyJump();
        donkeyJump.setFPS(60);
        donkeyJump.init();
        var ui = donkeyJump.ui;

  
        donkeyJump.onstart = function() {
            my.KeyEvent.addListener();
        }
        
        donkeyJump.onupdate = function() {
            if(my.KeyEvent.check('VK_LEFT') || my.KeyEvent.check('A')) {
                donkeyJump.keyDownLeft = true;
            } else {
                donkeyJump.keyDownLeft = false;
            }

            if(my.KeyEvent.check('VK_RIGHT') || my.KeyEvent.check('D')) {
                donkeyJump.keyDownRight = true;
            } else {
                donkeyJump.keyDownRight = false;
            }
        }
     
        donkeyJump.onstop = function() {
            my.KeyEvent.removeListener();
        }

        ui.onplay = function() {
            this.toBody();
            donkeyJump.stateInit();
            donkeyJump.start();
        }
       
        ui.onsoundopen = function() {
            Audio.mute = false;
            Audio.play('ogg_background', true);
        }
       
        ui.onsoundclose = function() {
            Audio.mute = true;
            Audio.pauseAll();
        }
        
        ui.onpause = function() {
            donkeyJump.pause();
            ui.panelResumeVisible(true);
            ui.btnPauseVisible(false);
        }
  
        ui.onresumeexit = function() {
            ui.toCover();
            ui.panelResumeVisible(false);
            Audio.play('ogg_background');
        }
 
        ui.onresume = function() {
            ui.panelResumeVisible(false);
            ui.btnPauseVisible(true);
            donkeyJump.start();
            Audio.play('ogg_background', true);
        }

        ui.onshowcup = ui.onshowcore = ui.onshowmore = ui.onshare = function() {
            alert('Temporarily has not realized the function, heartily anticipates!!!!');
        }
    }

})();
