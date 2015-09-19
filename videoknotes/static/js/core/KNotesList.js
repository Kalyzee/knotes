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
function KNotesList(initialValues){
  

    var _listeners = new KNotesListener(),
        _objectsById = [],
        _list = [],
        _this = this;

    var init = function(){
        for (i in initialValues){
            add(initialValues[i]);
        }
    }

    this.iterator = function(){
        return new KNoteIterator(_list);
    }


    var add = function(note){
         if (_list[note.getTime()] === undefined){
            _list[note.getTime()] = [];
        }        
        _objectsById[note.getId()] = note;
        _list[note.getTime()].push(note);

    }

    this.add = function(note){

        add(note);
        fireAdd(note);
    }

    this.remove = function(note){
        delete _objectsById[note.getId()];
        _list[note.getTime()].splice(_list[note.getTime()].indexOf(note), 1);
        fireRemove(note);
    }


    this.getById = function(id){
        return _objectsById[id];
    }

    /**
    *   Get all notes for a specified time
    */ 
    this.getByTime = function(time){
        var notesAtTime = _list[time];
        if( notesAtTime === undefined){
            notesAtTime = null;
        }
        return notesAtTime;
    }

    /*
    *   Get all by notes by time interval
    *   
    *   If you want to get a note in interval beetween 5 and 15 seconds
    *   getByInterval(10, 5);
    *
    *   -- TODO -- We need to optimise this method to 
    */  
    this.getByInterval = function(timeBegin, period){
        
        var result = [];
        var i;
        beginValue = Math.max(0,timeBegin-period);
        for (i = beginValue; i<=timeBegin+period; i++){
            var resultAtTime = _this.getByTime(i);
            if (resultAtTime !== null ){
                 result = result.concat(resultAtTime);
            }
        }
        return result;
    }

    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onAdd = function(callback){
      _listeners.addlisteners("onAdd", callback);
    }


    /*
    * Method called when a user click on delete note button
    */
    var fireAdd = function(note){
      _listeners.fireListeners("onAdd", function(callback){
        callback(note);
      });
    }    

    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onRemove = function(callback){
      _listeners.addlisteners("onRemove", callback);
    }


    /*
    * Method called when a user click on delete note button
    */
    var fireRemove = function(note){
      _listeners.fireListeners("onRemove", function(callback){
        callback(note);
      });
    }    
    
    init();
}
