/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    
    refreshFullViewComment();
        
    var params = {},

    paused = false,
    video = 'x2e4j6u',
    player = DM.player($('#dmapiplayer').get(0), {video: video, width: '720px', height: '480px', params: params});

    
    player.addEventListener("timeupdate", function(){
        searchAtTime(player.currentTime);
    });

    $("#post-comment textarea").keyup(function(event){
        if ( event.which == 13 && !event.shiftKey) {
            
            if($(this).val().trim().length > 1){
                addComment(createComment(user, new Date(), player.currentTime, $(this).val(), false));
                $(this).val("");
                
                paused = false;
                player.play();
                return true;
            }
        }else{
            if (!paused){
                paused = true;
                player.pause();
            }

        }
    });
    
    $("#videoknotes-pad").on("keypress", "div", function(event){
        console.log($(this).html());
    });
    
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
    
    function addComment(comment){
        comment.elm = createElementNote(comment);
        comments.push(comment);
        refreshFullViewComment();
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
        $("#videoknotes-pad .comment[data-id="+comment.id+"]").replaceWith(comment.elm);
    }
    
    function refreshFullViewComment(){
        document.getElementById("videoknotes-pad").innerHTML = "";
        for(var c in comments){
            comment = comments[c];
            document.getElementById('videoknotes-pad').appendChild(comment.elm);
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
        
        var btn_is_public       = document.createElement("button");
        btn_is_public.setAttribute("class", "btn-is_public fa fa-eye-slash");
        btn_is_public.setAttribute("title", "Rendre la note public");
        
        if(comment.is_public){
            btn_is_public.setAttribute("class", "btn-is_public fa fa-eye");
            btn_is_public.setAttribute("title", "Rendre la note privée");
        }
        
        btn_is_public.addEventListener("click", function(){
            changePublic(comment);
        });
        tool_part.appendChild(btn_is_public);
        
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
    
    function changePublic(current_comment){
        for(var c in comments){
            comment = comments[c];
            if(current_comment.id == comment.id){
                comments[c].is_public = !comment.is_public;
                refreshComment(comments[c]);
            }
        }
    }
});