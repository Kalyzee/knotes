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
            _view = new KNotesView(element),
            _list = null,
            _currentNote = null;


    

    function initPlayer(){
        _player = new PlayerFactory($(element).children(".player").get(0), config.video);
        _player.createPlayerView();
        _player.onTimeUpdate(function(time){
            searchAtTime(player.currentTime);
        });
    }

    function initKNotesEvents(){
        
        var array = [];
        for ( n in config.notes){
            var note = config.notes[n];
            array.push(new KNote(note.id, note.time, note.value));
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
                var note = new KNote(-1, _player.getCurrentTime(), note.value);
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

        _view.onRemoveNote(function(note){
            if(config.onRemoveNote){
                var note = _list.getById(note.id);
                config.onRemoveNote(note, function(){
                    _list.remove(note);
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

    function searchAtTime(time){


    }

    function redraw(){
        _view.clearNotes();
        var iterator = _list.iterator();
        while(iterator.hasNext()){
            var note = iterator.next();
            _view.createNote({"value" : note.getValue(), "id": note.getId(), "time": note.getTime(), "active" : note.isActive()});

        }        
    }


    init();

}
