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

        while ( _list[currentTimePosition] === undefined &&  currentTimePosition < _list.length ){
            currentTimePosition++;
        }


        if(currentTimePosition >= _list.length){
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
            return true;
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