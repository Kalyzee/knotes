function VideoKNotesBlock(runtime, element, init_args) {

    var _this = this;

    var kNotesPlugin;

    function init(){
        kNotesPlugin = new KNotesPlugin({
            "onNewNote" : _this.save,
            "onRemoveNote" : _this.remove,
            "onUpdateNote" : _this.update,
            "video"     :  init_args.video,
            "element"   :  element,
            "notes"     : init_args.notes,
            "onExportNotes" : _this.exportNotes
        });


    }

    this.exportNotes = function(){
      window.open(runtime.handlerUrl(element, 'export_notes'));
    }

    this.update = function(note, callback){
      $.ajax({
          type: "POST",
          url: runtime.handlerUrl(element, 'update_notes'),
          data: JSON.stringify({"pk":note.getId(), "content": note.getValue()}),
          success: function(result) {
              if(callback){
                callback(result);
              }
          }
      });

    }

    this.remove = function(note, callback){
      console.log(note);

      $.ajax({
          type: "POST",
          url: runtime.handlerUrl(element, 'delete_notes'),
          data: JSON.stringify({"pk":note.getId()}),
          success: function(result) {
            if(callback){
              callback(result);
            }
          }
      });
    }

    this.save = function(note, callback){
        $.ajax({
            type: "POST",
            url: runtime.handlerUrl(element, 'post_notes'),
            data: JSON.stringify({"seconds":note.getTime(), "content":note.getValue()}),
            success: function(result) {
              if (callback){
                callback(result);
              }
            }
        });
    }


    init();

}
