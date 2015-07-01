/**
* KNotes Listener System
*
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