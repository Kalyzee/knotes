function VideoKNotesBlock(runtime, element) {

    var _this = this;
    window.kalyzee = {}
    window.kalyzee.user = 1;
    window.kalyzee.video_id                = {};
    window.kalyzee.config                  = {};
    window.kalyzee.config.delay_comment    = 5;
    window.kalyzee.config.first_id         = 0;
    window.kalyzee.comments                = [];



    this.update = function(note){

    }

    $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_notes'),
            data: JSON.stringify({"comment_id":$("#videoknotes-editor").attr("data-id")}),
            success: function(results) {
                results = JSON.parse(results);
                for (id in results){
                    window.addComment(results[id]);
                }
                window.refreshFullViewComment();
            }
    });

    this.save = function(note){
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'post_notes'),
            data: JSON.stringify({"seconds":note.time_sec, "content":note.comment, "comment_id":$("#videoknotes-editor").attr("data-id")}),
            success: function(result) {
                console.log(result);
            }
        });
    }

    window.saved = _this.save;

    $("#btn-add").click(function(){
        _this.save({time_sec:10, comment:"test"});
    });
}