/*
* Manage note list
*
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
        _objectsById.splice(note.getId(),1);
        _list[note.getTime()].splice(_list[note.getTime()].indexOf(note), 1);
        fireRemove(note);
    }


    this.getById = function(id){
        console.log(_objectsById[id]);
        return _objectsById[id];
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
