function VideoKNotesBlock(runtime, element, init_args) {

    var _this = this;

    var kNotesPlugin;

    function init(){
        kNotesPlugin = new KNotesPlugin({
            "onNewNote" : _this.save,
            "onDeleteNote" : _this.delete,
            "onUpdateNote" : _this.update,
            "video"     :  init_args.video,
            "element"   :  element
        });


        results = init_args.notes;
        for (id in results){
            kNotesPlugin.addComment(results[id]);
        }

    }


    this.update = function(note){
      $.ajax({
          type: "POST",
          url: runtime.handlerUrl(element, 'update_notes'),
          data: JSON.stringify({"pk":note.id, "content": note.comment}),
          success: function(result) {
              console.log(result);
          }
      });

    }

    this.delete = function(note){
      console.log(note);

      $.ajax({
          type: "POST",
          url: runtime.handlerUrl(element, 'delete_notes'),
          data: JSON.stringify({"pk":note.id}),
          success: function(result) {
              console.log(result);
          }
      });
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
