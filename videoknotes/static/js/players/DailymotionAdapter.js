function DailymotionAdapter(element, video){


    var listeners = new KNotesListener(),
        _this = this;
        player = null;
        
    this.getCurrentTime = function(){
      return player.currentTime;
    }

    this.play = function(){
      return player.play();
    }

    this.pause = function(){
      return player.pause();
    }

    this.seek = function(time){
      player.seek(time);
    }

    this.createPlayerView = function(){
        var videoID = _this.getVideoID(video);
        player = DM.player(element, {"video": videoID, width: '720px', height: '480px', params: {} }),
        player.addEventListener("timeupdate", function(){
            fireTimeUpdate(player.currentTime);
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

    this.getVideoID = function(videoURL){
      
      var videoURLMatch = videoURL.match(DailymotionAdapter.regExp);
      var videoID = null;
      if (videoURLMatch != null){
        videoID = videoURLMatch[1];
      }
      return videoID;
    }

}


DailymotionAdapter.regExp = "[[http|https]://]{0,1}www.dailymotion.com\/video\/(.+)"
DailymotionAdapter.isCompatible = function(videoURL){

}