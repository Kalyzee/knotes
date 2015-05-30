/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){

    var comments = []
    refreshFullViewComment();
        
    var params = {},
    video = 'x6q96t',
    player = DM.player($('#dmapiplayer').get(0), {video: video, width: '720px', height: '480px', params: params});
    
    player.addEventListener("timeupdate", function(){
        searchAtTime(player.currentTime);
    });

    $("#btn-post-comment").on("click", function(){
        addComment(
            $('#post-comment').find('[name=username]').val(),
            new Date(),
            $('#post-comment').find('[name=time_sec]').val(),
            $('#post-comment').find('textarea').val(),
            false
        );
    });
    
    function addComment(user, datetime, time_sec, comment, is_public){
        config.first_id++;
        
        var c = {
            id: config.first_id,
            user: user, 
            datetime: datetime,
            time_sec: parseInt(time_sec),  
            comment: comment, 
            is_public: is_public, 
            is_active: false
        };
        comments.push(c);
        
        refreshFullViewComment();
    }
    
    function searchAtTime(time){
        document.getElementById("view-comment").innerHTML = "";
        for(var c in comments){
            comment = comments[c];
            
            if(time >= comment.time_sec && time < comment.time_sec+config.delay_comment){
                comment.is_active = true;
            }
        }
    }
    
    function refreshFullViewComment(){
        document.getElementById("full-view-comment").innerHTML = "";
        for(var c in comments){
            comment = comments[c];
            var elm = createElementNote(comment);
            document.getElementById('full-view-comment').appendChild(elm);
        }
    }
    
    function createElementNote(comment){
        var base                = document.createElement("div");
        base.setAttribute("class", "comment");
        
        if(comment.is_active){
            base.setAttribute("class", "active");
        }
        
        var tool_part           = document.createElement("div");
        tool_part.setAttribute("class", "tool-part");
        tool_part.innerHTML     = comment.is_public;
        
        var btn_is_public       = document.createElement("button");
        btn_is_public.setAttribute("class", "btn-is_public");
        btn_is_public.addEventListener("click", function(){
            console.log("btn_is_public clicked");
        });
        tool_part.appendChild(btn_is_public);
        
        var btn_play            = document.createElement("button");
        btn_play.setAttribute("class", "btn-play");
        btn_play.setAttribute("time_sec", comment.time_sec);
        btn_play.addEventListener("click", function(){
            console.log("btn_play clicked");
            player.seek(this.getAttribute("time_sec"));
        });
        tool_part.appendChild(btn_play);
        
        var time_part           = document.createElement("div");
        time_part.setAttribute("class", "time-part");
        time_part.innerHTML     = comment.time_sec;
        
        var comment_part        = document.createElement("div");
        comment_part.setAttribute("class", "comment-part");
        comment_part.innerHTML  = comment.comment;
        
        base.appendChild(tool_part);
        base.appendChild(time_part);
        base.appendChild(comment_part);
        return base;
    }
});