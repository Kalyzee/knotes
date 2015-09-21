/**

    This file is part of Knotes.

    Knotes is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Knotes is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Knotes.  If not, see <http://www.gnu.org/licenses/>.

    
    KNote Team (Alphabetical order) : 
        - Stephane Barbati  <stephane.barbati@kalyzee.com>
        - Ludovic Bouguerra <ludovic.bouguerra@kalyzee.com>
        - Anthony Gross     <anthony.gross@kalyzee.com>
        - Guillaume Laurie  <guillaume.laurie34@gmail.com>
        - Christian Surace  <christian.surace@kalyzee.com>        
        
    
*/
function KNotesView(element, canPublish){
    
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
      $(_element).find(".comment[data-id="+id+"] .comment-part").html(text);
    }

    this.removeNoteById = function(id){
      $(_element).find(".comment[data-id="+id+"]").remove();
    }

    this.updatePublicNoteById = function(id, public){
      $(_element).find(".comment[data-id="+id+"] .btn-public i.fa-eye").removeClass("fa-eye");
      $(_element).find(".comment[data-id="+id+"] .btn-public i.fa-eye-slash").removeClass("fa-eye-slash");

      if (public){
          $(_element).find(".comment[data-id="+id+"] .btn-public i.fa").addClass("fa-eye-slash");
      }else{
        $(_element).find(".comment[data-id="+id+"] .btn-public i.fa").addClass("fa-eye");
      }
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

      toolBar.appendChild(createButton("Play", "fa-play", "btn-play", function(){
        firePlayNote(note);
      }));

      if (note.mine){

        toolBar.appendChild(createButton("Edit", "fa-edit", "btn-update", function(){
          fireUpdateNote(note);
        }));
  
        toolBar.appendChild(createButton("Delete", "fa-remove", "btn-delete", function(){
          fireRemoveNote(note);
        }));


      }


      if (canPublish){
        if (note.public){
          toolBar.appendChild(createButton("Public", "fa-eye-slash", "btn-public", function(){
            firePublicNote(note);
          }));  
        }else{
          toolBar.appendChild(createButton("Public", "fa-eye", "btn-public", function(){
            firePublicNote(note);
          }));    
        }
   
      }

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

    /*
    * Method called when the user click on download button
    */
    var firePublicNote = function(note){
      listeners.fireListeners("onPublicNote", function(callback){
        callback(note);
      });
    } 

    /*
    * Method to add a callback when the user click on download button
    */
    this.onPublicNote = function(callback){
      listeners.addlisteners("onPublicNote", callback);
    }





}
