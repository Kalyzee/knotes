function YoutubeAdapter(element, video){

    var listeners = new KNotesListener(),
        _this = this;

    this.getCurrentTime = function(){
      return player.getCurrentTime();
    }

    this.play = function(){
      return player.playVideo();
    }

    this.pause = function(){
      return player.pauseVideo();
    }

    this.seek = function(time){
      player.seekTo(time);
    }


    this.createPlayerView = function(){
        
        if (YT == undefined || YT.Player == undefined){

            window.onYouTubePlayerAPIReady = function(){
                _this.createPlayerView();
            }
        }else{
                player = new YT.Player(element, {
                    height: '480',
                    width: '720',
                    videoId: getVideoId()
                });
                
                var t; 
                player.addEventListener("onStateChange", function(e){
                    if(e.data === 1){
                        t = setInterval(function(){ 
                            var time;
                            time = player.getCurrentTime();
                            fireTimeUpdate(time);
                        }, 100);
                    }
                    else {
                        clearInterval(t);
                    }
                });      
        }
    
    }

    this.onTimeUpdate = function(callback){
      listeners.addlisteners("onTimeUpdate", callback);
    }

    var fireTimeUpdate = function(time){
      listeners.fireListeners("onTimeUpdate", function(callback){
        callback(time);
      });
    }
    
    var getVideoId = function(){
        video_id    = video.match(/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/);
        if (video_id && video_id[7].length===11){
            return video_id[7];
        }
    }
}
