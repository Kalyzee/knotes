/**
* Knotes View
*
*/
function KNoteView(){
    
    this.createNote(note){
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
        alert("LISTENER PLAY");
      }));

      toolBar.appendChild(createButton("Modifier", "fa-edit", "btn-update", function(){
        alert("LISTENER Update");
      }));;

      toolBar.appendChild(createButton("Supprimer", "fa-remove", "btn-delete", function(){
        alert("LISTENER Delete");
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
}
