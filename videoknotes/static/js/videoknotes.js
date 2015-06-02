function VideoKNotesBlock(runtime, element, init_args) {

    console.log(init_args);

    var _this = this;

    var kNotesPlugin;

    function init(){
        kNotesPlugin = new KNotesPlugin({
            "onNewNote" : _this.save 
        } , init_args.video);


        results = init_args.notes;
        for (id in results){
            kNotesPlugin.addComment(results[id]);
        }

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