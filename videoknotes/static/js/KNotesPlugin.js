/*
 *
 *
 *
 *
 * @param config {
 *   onNewNote : function(){},
 *   element : element
 *   video   : dailymotion ID
 * }
 *
 */
function KNotesPlugin(config){

    var comments = [];

    var params =  {},
        paused = false,
        user = 1,
        player = null,
        _this = this,
        element = config.element,
        video   = config.video
        currentComment = null;
        config.delay_comment = 5;
        config.first_id = 0;

    

    function initPlayer(){
        player = DM.player($(element).children(".player").get(0), {video: config.video, width: '720px', height: '480px', params: params}),
        player.addEventListener("timeupdate", function(){
            searchAtTime(player.currentTime);
        });
    }

    function initKNotesEvents(){

        $(element).find(".post-comment textarea").keyup(function(event){
            if ( event.which == 13 && !event.shiftKey) {

                if($(this).val().trim().length > 1){
                    if (currentComment == null){
                      // In this case this is new note !!!
                      comment = createComment(user, new Date(), player.currentTime, $(this).val(), false);
                      if (typeof config.onNewNote === "function"){
                          config.onNewNote(comment);
                      }
                      _this.addComment(comment);
                      $(this).val("");

                      paused = false;
                      player.play();
                      return true;
                    }else{
                      // In this case we'll update an note  !!!
                      currentComment.comment = $(this).val().replace('\n', '<br />');;
                      config.onUpdateNote(currentComment);
                      _this.addComment(currentComment);
                      currentComment = null;
                      $(this).val("");
                      paused = false;
                      player.play();
                    }
                }
            }else{
                if (!paused){
                    paused = true;
                    player.pause();
                }

            }
        });

    }


    function init(){
        initPlayer();
        initKNotesEvents();
        _this.refreshFullViewComment();
    }


    function createComment(user, datetime, time_sec, comment, is_public){
        config.first_id++;

        comment = comment.replace('\n', '<br />');

        var c = {
            id: config.first_id,
            user: user,
            datetime: datetime,
            time_sec: parseInt(time_sec),
            comment: comment,
            is_public: is_public,
            is_active: false
        };
        return c;
    }

    this.addComment = function(comment){

        if(comment.id === undefined){
            comment.id = config.first_id;
            config.first_id++;
        }

        comment.elm = createElementNote(comment);
        comments.push(comment);
        _this.refreshFullViewComment();
    }

    function searchAtTime(time){
        for(var c in comments){
            comment = comments[c];

            if(time >= comment.time_sec && time < comment.time_sec+config.delay_comment){
                if(!comment.is_active){
                    comments[c].is_active = true;
                    refreshComment(comments[c]);
                }
            }
            else{
                if(comments[c].is_active){
                    comments[c].is_active = false;
                    refreshComment(comments[c]);
                }
            }
        }
    }

    function refreshComment(comment){
        comment.elm = createElementNote(comment);
        $(element).find(".videoknotes-pad .comment[data-id="+comment.id+"]").replaceWith(comment.elm);
    }

    this.refreshFullViewComment = function(){
        $(element).find('.videoknotes-pad').innerHTML = "";
        for(var c in comments){
            comment = comments[c];
              $(element).find('.videoknotes-pad').append(comment.elm);
        }
    }


    function createElementNote(comment){
        var base                = document.createElement("div");
        base.setAttribute("class", "comment");
        base.setAttribute("data-id", comment.id);

        if(comment.is_active){
            base.setAttribute("class", "comment active");
        }

        var tool_part           = document.createElement("div");
        tool_part.setAttribute("class", "tool-part part");

        /*var btn_is_public       = document.createElement("button");
        btn_is_public.setAttribute("class", "btn-is_public fa fa-eye-slash");
        btn_is_public.setAttribute("title", "Rendre la note publique");

        if(comment.is_public){
            btn_is_public.setAttribute("class", "btn-is_public fa fa-eye");
            btn_is_public.setAttribute("title", "Rendre la note priv&eacute;e");
        }

        btn_is_public.addEventListener("click", function(){
            changePublic(comment);
        });
        tool_part.appendChild(btn_is_public);
        */
        var btn_play            = document.createElement("button");
        btn_play.setAttribute("class", "btn-play");
        btn_play.innerHTML      = "<i class='fa fa-play'></i>";
        btn_play.setAttribute("title", "Lire");

        if(comment.is_active){
            btn_play.innerHTML      = "<i class='fa fa-circle-o-notch fa-spin'></i>";
            btn_play.setAttribute("title", "En cours de lecture");
        }
        btn_play.setAttribute("time_sec", comment.time_sec);
        btn_play.addEventListener("click", function(){
            player.seek(this.getAttribute("time_sec"));
        });
        tool_part.appendChild(btn_play);

        var btn_update           = document.createElement("button");
        btn_update.setAttribute("class", "btn-update");
        btn_update.innerHTML      = "<i class='fa fa-edit'></i>";
        btn_update.setAttribute("title", "Update");
        tool_part.appendChild(btn_update);
        btn_update.addEventListener("click", function(){
          updateComment(comment);
        });

        var btn_delete = document.createElement("button");
        btn_delete.setAttribute("class", "btn-delete");
        btn_delete.addEventListener("click", function(){
          deleteComment(comment);
        });
        btn_delete.innerHTML      = "<i class='fa fa-remove'></i>";

        tool_part.appendChild(btn_delete);


        var time_part           = document.createElement("div");
        time_part.setAttribute("class", "time-part part");
        time_part.innerHTML     = "<i class='fa fa-clock-o'></i> "+comment.time_sec;

        var comment_part        = document.createElement("div");
        comment_part.setAttribute("class", "comment-part part");
        comment_part.innerHTML  = comment.comment;

        base.appendChild(tool_part);
        base.appendChild(time_part);
        base.appendChild(comment_part);

        return base;
    }


    function deleteComment(comment){
      var index = comments.indexOf(comment);
      delete comments[index];
      $(element).find(".videoknotes-pad .comment[data-id="+comment.id+"]").remove();
      if (typeof config.onDeleteNote === "function"){
          config.onDeleteNote(comment);
      }
    }


    function updateComment(comment){
      currentComment = comment;

      var index = comments.indexOf(comment);
      delete comments[index];
      $(element).find(".videoknotes-pad .comment[data-id="+comment.id+"]").remove();
      $(element).find(".post-comment textarea").val(currentComment.comment.replace("<br />", "\n"));

    }

    function changePublic(current_comment){
        for(var c in comments){
            comment = comments[c];
            if(current_comment.id == comment.id){
                comments[c].is_public = !comment.is_public;
                refreshComment(comments[c]);
            }
        }
    }

    init();

}
