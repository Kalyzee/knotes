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
function KNotesListener(){

  var _listeners = new Array();

  this.addlisteners = function(eventName, listener){
    if (_listeners[eventName] === undefined){
      _listeners[eventName] = new Array();
    }
    _listeners[eventName].push(listener);
  }

  this.fireListeners = function(eventName, callback){
    for (listener in _listeners[eventName]){
        if (typeof(_listeners[eventName][listener]) === "function" ){
            callback(_listeners[eventName][listener]);
        }
    }
  }

}