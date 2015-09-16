/**
* Knotes View
*
*/
function KNotesView(element){
    
    var listeners = new KNotesListener();
    var _this = this;
    var _element = element;

    var _edition = false;

    var _noteField = $(_element).find(".post-comment textarea");
    var _notePad   = $(element).find(".videoknotes-pad");

    var _downloadButton = $(element).find(".download-button");

    this.initViewEvents = function(){
        _noteField.keyup(function(event){
            if ( event.which == 13 && !event.shiftKey) {
                if($(this).val().trim().length > 1){
                  _edition = false;
                  fireSaveNote({"value" : $(this).val()});
                }
            }else{
                if (_edition == false){
                  _edition = true;
                  fireBeginEditNote();
                }

            }
        });

        _downloadButton.click(function(){
          fireExportNotes();
        });
    }

    this.cleanNoteField = function(){
        $(_noteField).val("");
    }


    this.setNoteField = function(text){
      $(_noteField).val(text);
    }

    this.updateNoteById = function(id, text){
      $(".comment[data-id="+id+"] .comment-part").html(text);
    }

    this.removeNoteById = function(id){
      $(".comment[data-id="+id+"]").remove();
    }

    /**
    * Color note with specified ID
    */
    this.colorNotes = function(ids){
      $(_element).find(".comment.active").removeClass("active");
      for (key in ids){
        $(_element).find(".comment[data-id="+ids[key]+"]").addClass("active");
      }
    }

    this.clearNotes = function(){

      $(_notePad).html("");

    }
    this.createNote = function(note){
      var base                = document.createElement("div");
      base.setAttribute("class", "comment");
      base.setAttribute("data-id", note.id);

      if(note.active){
          base.setAttribute("class", "comment active");
      }

      base.appendChild(createNoteToolBar(note));
      base.appendChild(createTimeBar(note.time));
      base.appendChild(createCommentPart(note.value));

      $(_notePad).append(base);
    }

    var createNoteToolBar = function(note){
      var toolBar           = document.createElement("div");
      toolBar.setAttribute("class", "tool-part part");

      toolBar.appendChild(createButton("Lire", "fa-play", "btn-play", function(){
        firePlayNote(note);
      }));

      toolBar.appendChild(createButton("Modifier", "fa-edit", "btn-update", function(){
        fireUpdateNote(note);
      }));;

      toolBar.appendChild(createButton("Supprimer", "fa-remove", "btn-delete", function(){
        fireRemoveNote(note);
      }));

      return toolBar;
    }


    var createTimeBar = function(time){
      var timePart           = document.createElement("div");
      timePart.setAttribute("class", "time-part part");

      var fontAwesomeClock = document.createElement("i");
      fontAwesomeClock.setAttribute("class", "fa fa-clock-o");
      timePart.appendChild(fontAwesomeClock);
      timePart.appendChild(document.createTextNode(time));

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
    var fireBeginEditNote = function(){
      listeners.fireListeners("onBeginEditNote", function(callback){
        callback();
      });
    }

    /*
    * Method to add a callback when the user save a specific note
    */
    this.onBeginEditNote = function(callback){
      listeners.addlisteners("onBeginEditNote", callback);
    }



    /*
    * Method called when a user save a note
    */
    var fireSaveNote = function(note){
      listeners.fireListeners("onSaveNote", function(callback){
        callback(note);
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
    var firePlayNote = function(note){
      listeners.fireListeners("onPlayNote", function(callback){
          callback(note);
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
    var fireUpdateNote = function(note){
      listeners.fireListeners("onUpdateNote", function(callback){
          callback(note);
      });
    }

    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onRemoveNote = function(callback){
      listeners.addlisteners("onRemoveNote", callback);
    }


    /*
    * Method called when a user click on delete note button
    */
    var fireRemoveNote = function(note){
      listeners.fireListeners("onRemoveNote", function(callback){
        callback(note);
      });
    }    


    /*
    * Method to add a callback when the user click on download button
    */
    this.onExportNotes = function(callback){
      listeners.addlisteners("onExportNotes", callback);
    }


    /*
    * Method called when the user click on download button
    */
    var fireExportNotes = function(){
      listeners.fireListeners("onExportNotes", function(callback){
        callback();
      });
    }        




}
