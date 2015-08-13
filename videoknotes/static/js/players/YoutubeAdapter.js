function YoutubeAdapter(element, video){

    // This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
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
