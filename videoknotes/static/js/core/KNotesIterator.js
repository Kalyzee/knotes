/*
* Manage note list
*
*/
function KNoteIterator(list){
    var _this = this, 
        _currentTimePosition = 0,
        _currentObjectPosition = -1,
        _list = list;

    var getNextPointerPosition = function(){
        var currentTimePosition = _currentTimePosition;
        var currentObjectPosition = _currentObjectPosition;

        currentObjectPosition++;
        
        if ( _list[currentTimePosition] !== undefined && _list[currentTimePosition][currentObjectPosition] !== undefined){
            return { "timePosition" : currentTimePosition, "objectPosition" : currentObjectPosition };
        }else{
            currentTimePosition++;
            currentObjectPosition = 0;
        }

        while ( _list[currentTimePosition] === undefined &&  currentTimePosition <= _list.length ){
            currentTimePosition++;
        }

        if(currentTimePosition <= _list.length){
            return null;
        }else{
            return { "timePosition" : currentTimePosition, "objectPosition" : currentObjectPosition };
        }

    }

    var setPointerAtNextPosition = function(){
        
        var pointerPosition = getNextPointerPosition();
        
        if (pointerPosition != null){
            _currentTimePosition = pointerPosition.timePosition;
            _currentObjectPosition = pointerPosition.objectPosition;
        }else{
            return null;    
        }

    }

    this.hasNext = function(){
        return getNextPointerPosition() != null;
    }

    this.next = function(){
        if (setPointerAtNextPosition()){
            return list[_currentTimePosition][_currentObjectPosition];
        }else{
            return null;
        }
        
    }

    this.reset = function(){
        _currentTimePosition = 0;
        _currentObjectPosition = -1;

    }


}