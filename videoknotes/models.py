# -*- coding: utf-8 -*-

"""

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
        
        
"""

from django.db import models
from django.db.models import Q

from django.contrib.auth.models import User
from xmodule_django.models import LocationKeyField 


class KNoteListManager(models.Manager):
    """KNoteListManager

    """     


    def get_note_list(self, user, block):
        """Return KNoteList filtered by user and block
        
        Args: 
            user  : instance of Django User Model
            block : XBlock usage ID
        
        Returns:
            KNoteList instance

        Raises: 
            KNoteList.DoesNotExist If there is not note_list
        """        
        return self.get(user=user, block=block)

    def get_or_create_note_list(self, user, block):
        """Return KNoteList filtered by user and block or creates ones 
        if not exists
        
        Args: 
            user  : instance of Django User Model
            block : XBlock usage ID
        
        Returns:
            KNoteList instance

        """        
        note_list = None
        try:
            note_list = self.get_note_list(user=user, block=block)
        except KNoteList.DoesNotExist:
            note_list = KNoteList(user=user, block=block)
            note_list.save()

        return note_list


class KNoteList(models.Model):
    """KNoteList Model
        Represent a set a KNote related to a user and a block
    """     


    class Meta:
        unique_together = (("user", "block"),)

    objects = KNoteListManager()


    """Owner of the KNote set
    """   
    user = models.ForeignKey(User)
    
    """ 
       The Block related
        TODO check how to do a foreignkey to the Xblock 
    """
    block = LocationKeyField(max_length=255, db_index=True)


class KNoteManager(models.Manager):
   
    def list_notes_public_for_course_and_block(self, user_pk, block):
        """Return Both of public notes and user's notes sorted by time
        
        Args: 
            user_pk  : The user id
            block : XBlock usage ID
        
        Returns:
            KNote

        """          
        return self.filter( (Q(timecoded_comment__user__pk=user_pk) & Q(timecoded_comment__block=block) )| (Q(is_public=True) & Q(timecoded_comment__block=block))).order_by("seconds")


class KNote(models.Model):
    """
        KNote Model
        Represent a timecoded note

    """
    objects = KNoteManager()

    """
        Link with KNoteList
    """  
    timecoded_comment = models.ForeignKey(KNoteList)
    
    """
        Time in seconds
    """    
    seconds = models.IntegerField(default=0)

    """
        Note content
    """     
    content = models.TextField()

    """
        Is a public note ?
    """     
    is_public = models.BooleanField(default=False)
