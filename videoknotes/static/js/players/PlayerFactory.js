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
function PlayerFactory(element, video){

    var init = function(){
        var adapter = null;
        var i=0;
        while (adapter==null && i< PlayerFactory.players.length){

            if (PlayerFactory.players[i].isCompatible(video)){
                adapter = PlayerFactory.players[i];
            }

            i = i+1;
        }

        if (adapter != null){
            return new adapter(element, video);
        }
    };
        
    return init();
}

PlayerFactory.players = [];

PlayerFactory.registerPlayer = function(playerAdapter){
    PlayerFactory.players.push(playerAdapter);
}