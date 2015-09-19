/**
    
    KNote by Kalyzee

    Xblock for openedx plateform which allow students taking notes from video. 

    
    KNote Team (Alphabetical order) : 
        - Stephane Barbati  <stephane.barbati@kalyzee.com>
        - Ludovic Bouguerra <ludovic.bouguerra@kalyzee.com>
        - Anthony Gross     <anthony.gross@kalyzee.com>
        - Guillaume Laurie  <guillaume.laurie34@gmail.com>
        - Christian Surace  <christian.surace@kalyzee.com>        
        
        
*/
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
            is_dailymotion      = videoURL.match(DailymotionAdapter.regExp);
            return is_dailymotion;
            
}

PlayerFactory.registerPlayer(DailymotionAdapter);