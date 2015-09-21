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

    var listeners = new KNotesListener(),
        params =  {},
        paused = false,
        user = 1,
        _this = this,
        element = config.element,
        video   = config.video,
        currentComment = null;

        config.delay_comment = 5;
        config.first_id = 0;


        var _this = this,
            _player = null,
            _view = new KNotesView(element, config.can_publish),
            _list = null,
            _currentNote = null;


    

    function initPlayer(){
        _player = new PlayerFactory($(element).children(".player").get(0), config.video);
        _player.createPlayerView();
        _player.onTimeUpdate(function(time){
            searchAtTime(time);
        });
    }

    function initKNotesEvents(){
        
        var array = [];
        for ( n in config.notes){
            var note = config.notes[n];
            array.push(new KNote(note.id, note.time, note.value, note.public, note.mine));
        }

        _list = new KNotesList(array);

        _view.initViewEvents();
        _view.onBeginEditNote(function(){
            _player.pause();

        });

        _view.onSaveNote(function(note){
            _view.cleanNoteField();
            _player.play();

            if(_currentNote){
                if (config.onUpdateNote){
                    _currentNote.setValue(note.value);
                    config.onUpdateNote(_currentNote, function(result){
                        if(result.result == "success"){
                            _view.updateNoteById(_currentNote.getId(), _currentNote.getValue());
                        }
                        _currentNote = null;

                    });
                }
            }else{
                var note = new KNote(-1, Math.floor(_player.getCurrentTime()), note.value, false, true);
                if(config.onNewNote){
                    config.onNewNote(note, function(result){
                    if(result.result = "success"){
                        note.setId(result.id);
                        _list.add(note);
                    }
                }); 
            }

            }

            
        });


        _view.onPlayNote(function(note){
            _player.seek(note.time);
        });

        _view.onUpdateNote(function(note){
            _view.setNoteField(note.value);
            _currentNote = _list.getById(note.id);
        });

        _view.onExportNotes(function(){
            if(config.onExportNotes)
                config.onExportNotes();
        }); 

        _view.onRemoveNote(function(note){
            if(config.onRemoveNote){
                var note = _list.getById(note.id);
                config.onRemoveNote(note, function(){
                    _list.remove(note);
                });
            }

        });

        _view.onPublicNote(function(note){
            if(config.onPublishNote){
                var note = _list.getById(note.id);
                note.setPublic(!note.isPublic());
                config.onPublishNote(note, function(){
                    _view.updatePublicNoteById(note.getId(), note.isPublic());
                }); 

            }

        });

        _list.onAdd(function(note){
            redraw();            
        });

        _list.onRemove(function(note){
            _view.removeNoteById(note.getId());
        });       

        redraw();

    }


    function init(){
        initPlayer();
        initKNotesEvents();
    }

    /**
    *   TODO Optimization to not make for on each onTimePlayer
    *   New strategie will store the next note time in variable to iterate only if a note exists.
    */
    function searchAtTime(time){
        ids = [];
        var notesAtTime = _list.getByInterval(Math.round(time), config.delay_comment);
        if (notesAtTime != null){
            for (key in notesAtTime){
                ids.push(notesAtTime[key].getId());
            }   
        }
        _view.colorNotes(ids);
    }

    function redraw(){
        _view.clearNotes();
        var iterator = _list.iterator();
        var i = 0;
        while(iterator.hasNext()){
            var note = iterator.next();
            _view.createNote({"value" : note.getValue(), "id": note.getId(), "time": note.getTime(), "active" : note.isActive(), "mine" : note.isMine(), "public": note.isPublic() });
            i++;
        }        
    }


    init();

}
