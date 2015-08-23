function PlayerFactory(element, video){

    var youtube_regexp      = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
        dailymotion_regexp  = /^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/;

    var init = function(){
        is_youtube          = video.match(youtube_regexp);
        if (is_youtube && is_youtube[7].length===11){
            return new YoutubeAdapter(element, video);
        }
        else{
            is_dailymotion      = video.match(dailymotion_regexp);
            if (is_dailymotion && (is_dailymotion[4] !== undefined || is_dailymotion[2] !== undefined)){
                return new DailymotionAdapter(element, video);
            }
        }
    };
        
    return init();
}
