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
function KNote(id, time, value, public, mine){
   
  var listeners = new KNotesListener(),
      _this = this,
      _id = id,
      _time = time,
      _value = value,
      _active = false,
      _isPublic = public,
      _isMine = mine;

    /**
    * SETTERS AND GETTERS
    * 
    */

    this.setTime = function(time){
      
      var eventObject = {"time": time, "timeOld" : _time};
    
      _time = time;
      
      fireEdit(eventObject);
    }

    this.getTime = function(){
      return _time;
    }

    this.setValue = function(value){

      var eventObject = {"value": value, "valueOld" : _value};
      _value = value;
      fireEdit(eventObject);
    }

    this.getValue = function(){
      return _value;
    }

    this.setId = function(id){
      
      var eventObject = {"id": id, "idOld" : _id};
      
      _id = id;

      fireEdit(eventObject);
    }

    this.getId = function(){
      return _id;
    }

    this.getValue = function(){
      return _value;
    }    


    this.setActive = function(active){
      var eventObject = {"active": active, "idActive" : _active};
      _active = active;
    }

    this.isActive = function(){
      return _active;
    }


    this.isPublic = function(){
      return _isPublic;
    }

    this.setPublic = function(isPublic){
      _isPublic = isPublic;
    }

    this.isMine = function(){
      return _isMine;
    }

    this.setIsMine = function(isMine){
      _isMine = isMine;
    }    

    /*
    * Method called when a user click on delete note button
    */
    var fireEdit = function(updatedField){
      listeners.fireListeners("onEdit", function(callback){
        callback(_this, updatedField);
      });
    }

    /*
    * Method to add a callback when the user click on delete on a specific note
    */
    this.onEdit = function(callback){
      listeners.addlisteners("onEdit", callback);
    }

}
