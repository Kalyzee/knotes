/**
* Knotes View
*
*/
function KNoteView(){
    
    var listeners = new KNotesListener();
    var _this = this;

    this.createNote = function(note){
      var base                = document.createElement("div");
      base.setAttribute("class", "comment");
      base.setAttribute("data-id", comment.id);

      if(comment.is_active){
          base.setAttribute("class", "comment active");
      }

      base.appendChild(createNoteToolBar());
      base.appendChild(createTimeBar());
      base.appendChild(createCommentPart());

      return base;
    }

    var createNoteToolBar = function(){
      var toolBar           = document.createElement("div");
      toolBar.setAttribute("class", "tool-part part");

      toolBar.appendChild(createButton("Lire", "fa-play", "btn-play", function(){
        _this.firePlayNote();
      }));

      toolBar.appendChild(createButton("Modifier", "fa-edit", "btn-update", function(){
        _this.fireUpdateNote();
      }));;

      toolBar.appendChild(createButton("Supprimer", "fa-remove", "btn-delete", function(){
        _this.fireDeleteNote();
      }));

      return toolBar;
    }


    var createTimeBar = function(){
      var timePart           = document.createElement("div");
      timePart.setAttribute("class", "time-part part");

      var fontAwesomeClock = document.createElement("i");
      i.setAttribute("class", "fa fa-clock-o");
      timePart.appendChild(fontAwesomeClock);
      timePart.appendChild(document.createTextNode(comment.time_sec));

      return timePart;
    }

    /**
    * Create and return a button for noteToolBar
    */
    var createButton = function(label, fontAwesomeClass, className, onClick){
      var btn            = document.createElement("button");
      btn.setAttribute("class", className);
      var fontAwesomeIcon = document.createElement("i");
      fontAwesomeIcon.setAttribute("class", "fa "+fontAwesomeClass);
      btn.appendChild(fontAwesomeIcon);
      btn.setAttribute("title", label);
      btn.addEventListener("click" , onClick);
      return btn;
    }


    var createCommentPart = function(text){
      var commentPart        = document.createElement("div");
      commentPart.setAttribute("class", "comment-part part");
      commentPart.innerHTML  = text;
      return commentPart;
    }

    /*
    * Method called when a user save a note
    */
    var fireSaveNote = function(){
      listeners.fireListeners("onSaveNote", function(callback){

      });
    }

    /*
    * Method to add a callback when the user save a specific note
    */
    this.onSaveNote = function(callback){
      listeners.addlisteners("onSaveNote", callback);
    }

    /*
    * Method to add a callback when the user push play on a specific note
    */
    this.onPlayNote = function(callback){
      listeners.addlisteners("onPlayNote", callback);
    }

    /*
    * Method called when a user click on a note
    */
    var firePlayNote = function(){
      listeners.fireListeners("onPlayNote", function(callback){

      });
    }

    /*
    * Method to add a callback when the user click on update on a specific note
    */
    this.onUpdateNote = function(callback){
      listeners.addlisteners("onUpdateNote", callback);
    }

    /*
    * Method called when a user click on update note button
    */
    var fireUpdateNote = function(){
      listeners.fireListeners("onUpdateNote", function(callback){

      });
    }

    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onDeleteNote = function(callback){
      listeners.addlisteners("onDeleteNote", callback);
    }


    /*
    * Method called when a user click on delete note button
    */
    var fireDeleteNote = function(){
      listeners.fireListeners("onDeleteNote", function(callback){

      });
    }    


}
