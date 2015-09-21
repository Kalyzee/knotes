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
            "onExportNotes" : _this.exportNotes,
            "onPublishNote" : _this.publish,
            "can_publish": init_args.can_publish
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

    this.publish = function(note, callback){
      $.ajax({
          type: "POST",
          url: runtime.handlerUrl(element, 'publish_notes'),
          data: JSON.stringify({"pk":note.getId(), "public":note.isPublic()}),
          success: function(result) {
            if(callback){
              callback(result);
            }
          }
      });
    }

    this.remove = function(note, callback){
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
