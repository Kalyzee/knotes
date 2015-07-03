function DailymotionAdapter(element, video){

    var listeners = new KNotesListener(),
        _this = this;

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
        player = DM.player(element, {"video": video, width: '720px', height: '480px', params: {} }),
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

}
