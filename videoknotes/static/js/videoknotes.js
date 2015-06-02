function VideoKNotesBlock(runtime, element) {

    var _this = this;

    var kNotesPlugin;

    function init(){
        kNotesPlugin = new KNotesPlugin({
            "onNewNote" : _this.save 
        } ,"x2e4j6u");

        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'get_notes'),
            data: JSON.stringify({"comment_id":$("#videoknotes-editor").attr("data-id")}),
            success: function(results) {
                results = JSON.parse(results);
                for (id in results){
                    kNotesPlugin.addComment(results[id]);
                }
                kNotesPlugin.refreshFullViewComment();
            }
        });

    }


    this.update = function(note){

    }



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


    init();

}