/*
* Manage note list
*
*/
function KNotesList(){
  

    var listeners = new KNotesListener(),
        objectsById = {},
        list = [],
        _this = this;



    this.iterator = function(){
        return new KNoteIterator(list);
    }

    this.add = function(note){

        if (list[note.getTime()] === undefined){
            list[note.getTime()] = [];
        }
        list[note.getTime()].push(note);
        fireAdd(note);
    }

    this.remove = function(note){
        fireDelete(note);
    }


    this.getById = function(){

    }


    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onAdd = function(callback){
      listeners.addlisteners("onAdd", callback);
    }


    /*
    * Method called when a user click on delete note button
    */
    var fireAdd = function(note){
      listeners.fireListeners("onAdd", function(callback){
        callback(note);
      });
    }    

    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onRemove = function(callback){
      listeners.addlisteners("onRemove", callback);
    }


    /*
    * Method called when a user click on delete note button
    */
    var fireRemove = function(note){
      listeners.fireListeners("onRemove", function(callback){
        callback(note);
      });
    }    
    
}
