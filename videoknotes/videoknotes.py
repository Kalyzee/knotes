# -*- coding: utf-8 -*-


"""
    KNote by Kalyzee

    Xblock for openedx plateform which allow students taking notes from video. 

    
    KNote Team (Alphabetical order) : 
        - Stephane Barbati  <stephane.barbati@kalyzee.com>
        - Ludovic Bouguerra <ludovic.bouguerra@kalyzee.com>
        - Anthony Gross     <anthony.gross@kalyzee.com>
        - Guillaume Laurie  <guillaume.laurie34@gmail.com>
        - Christian Surace  <christian.surace@kalyzee.com>        
        
        
"""

import pkg_resources

"""
    XBlock api import
"""
from xblock.core import XBlock
from xblock.fields import Scope, String
from xblock.fragment import Fragment


"""
    OpenEdx ACL import
"""
from student.auth import has_studio_write_access


"""
    Django models import
"""
from django.contrib.auth.models import User


"""
"""
from webob import Response

"""
     ReportLab imports
"""
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.platypus import Table, TableStyle, Paragraph


"""
    KNotes model import
"""
from .models import KNoteList, KNote



class VideoKNotesBlock(XBlock):
    """
    VideoKNotesBlock allows the users to create comments timecoded (means comments can be located in time).
    Users can export all visible comments as CSV.
    Owners can share their comment when they mark them as public.
    Student can comment as private.
    """


    """Video URL
    """ 
    href = String(help="Video URL", default="http://www.dailymotion.com/video/x2e4j6u", scope=Scope.content)

    def student_view(self, context):
        """
        Show all knotes for the current user and the owner(s) which are in public state.
        """
        student = self.__get_current_user()

        comment = KNoteList.objects.get_or_create_note_list(student, self.__get_xblock_key())

            
        """Find all knotes ordered by seconds"""
        timecoded_data_set = self.__list_notes()
        timecoded_data_array = []
        for timecoded_data in timecoded_data_set:
            """Convert Knote objects (python) to Knote objects (Javascript) """
            obj = {"time": timecoded_data.seconds, "value":timecoded_data.content, "user": self.scope_ids.user_id , "public": timecoded_data.is_public, "mine": (self.scope_ids.user_id == timecoded_data.timecoded_comment.user.pk) , "id": timecoded_data.id}
            timecoded_data_array.append(obj)



        # Load the HTML fragment from within the package and fill in the template
        html_str = pkg_resources.resource_string(__name__, "static/html/videoknotes.html")
        frag = Fragment(unicode(html_str).format(self=self, href=self.href, comment_id=comment.pk))

        css_str = pkg_resources.resource_string(__name__, "static/css/style.css")
        frag.add_css(unicode(css_str))

        frag.add_javascript_url("http://api.dmcdn.net/all.js")
        frag.add_javascript_url("https://www.youtube.com/iframe_api")


        javascript_array = ["static/js/core/KNotesListener.js", "static/js/core/KNote.js", 
            "static/js/core/KNotesIterator.js", "static/js/core/KNotesList.js", "static/js/players/PlayerFactory.js", "static/js/players/DailymotionAdapter.js",
            "static/js/players/YoutubeAdapter.js",
            "static/js/core/KNotesView.js", "static/js/core/KNotesPlugin.js", 
            "static/vendors/swfobject.js"]

        for element in javascript_array:
            js_str = pkg_resources.resource_string(__name__, element)
            frag.add_javascript(unicode(js_str))

        js_str = pkg_resources.resource_string(__name__, "static/js/videoknotes.js")
        frag.add_javascript(unicode(js_str))
        frag.initialize_js('VideoKNotesBlock', {"video" : self.href, "notes" : timecoded_data_array, "can_publish" : has_studio_write_access(student, self.scope_ids.usage_id.course_key)})


        return frag

    def studio_view(self, context):
        """
        Create a fragment used to display the edit view in the Studio.
        """
        html_str = pkg_resources.resource_string(__name__, "static/html/videoknotes_edit.html")
        href = self.href or ''
        frag = Fragment(unicode(html_str).format(href=href))

        js_str = pkg_resources.resource_string(__name__, "static/js/videoknotes_edit.js")
        frag.add_javascript(unicode(js_str))
        frag.initialize_js('VideoKNotesEditBlock')

        return frag

    @XBlock.json_handler
    def studio_submit(self, data, suffix=''):
        """
        Called when submitting the form in Studio.
        """
        self.href = data.get('href')

        return {'result': 'success'}


    @XBlock.json_handler
    def post_notes(self, data, suffix=''):
        """Publish a note
        """         
        student = self.__get_current_user()
        timecoded = KNoteList.objects.get(user=student, block=self.__get_xblock_key())

        if (timecoded.user.pk == self.scope_ids.user_id):
            timecoded_content = KNote(seconds=data.get('seconds'), content=data.get("content"), timecoded_comment=timecoded)
            timecoded_content.save()            
            return {'result': 'success', 'id' : timecoded_content.pk}
        else: 
            return {'error': 'bad credential'}


    @XBlock.json_handler
    def update_notes(self, data, suffix=''):
        """Update a note
        """ 
        timecoded = KNote.objects.get(pk=data.get("pk"))
        if (timecoded.timecoded_comment.user.pk == self.scope_ids.user_id):
            timecoded.content = data.get("content")
            timecoded.save()
            return {'result': 'success'}
        else :
            return {'error': 'bad credential'}

    @XBlock.json_handler
    def publish_notes(self, data, suffix=''):
        """Make a note public only for the teacher
        """ 
        student = self.__get_current_user()
        timecoded = KNote.objects.get(pk=data.get("pk"))
        if ((timecoded.timecoded_comment.user.pk == self.scope_ids.user_id) and (has_studio_write_access(student, self.scope_ids.usage_id.course_key))):
            is_public = False
            if (data.get("public") == "true"):
                is_public = True
            timecoded.is_public = data.get("public")
            timecoded.save()
            return {'result': 'success'}
        else :
            return {'error': 'bad credential'}


    @XBlock.json_handler
    def delete_notes(self, data, suffix=''):
        """Delete a given note


        """ 
        timecoded = KNote.objects.get(pk=data.get("pk"))
        if (timecoded.timecoded_comment.user.pk == self.scope_ids.user_id):
            timecoded.delete()
            return {'result': 'success'}
        else:
            return {'error': 'bad credential'}
        
    @XBlock.handler
    def export_notes(self, request, suffix=''):
        """ Return an pdf export of user and public notes

        Returns:
            response

        """ 
        res = Response()
        student = self.__get_current_user()

        try:
            timecoded_data_set = self.__list_notes()
            timecoded_data_array = []

            for timecoded_data in timecoded_data_set:
                timecoded_data_array.append([timecoded_data.seconds, Paragraph(timecoded_data.content.replace('\n','<br />'), ParagraphStyle("Page"))])


            res.headerlist = [('Content-type', 'application/pdf'), ('Content-Disposition', 'attachment; filename=%s' % str(self.scope_ids.user_id)+".pdf")]
            p = canvas.Canvas(res)
            if (len(timecoded_data_array)>0):
                table = Table(timecoded_data_array, colWidths=[20, 500])
                table.setStyle(TableStyle([('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
                                            ('BOX', (0, 0), (-1, -1), 0.25, colors.black)]))
                
                table.wrapOn(p, 700, 700)
                table.drawOn(p, 50, 700)
                
            p.showPage()
            p.save()

            return res
        except KNoteList.DoesNotExist:
            res.status = 404
            return res

    def __get_current_user(self):
        """Return Current User

        Returns:
            User current user

        """              
        return User.objects.get(id=self.scope_ids.user_id)

    def __list_notes(self):
        """Return Both of public notes and user's notes sorted by time

        Returns:
            KNotes

        """          
        return KNote.objects.list_notes_public_for_course_and_block( self.scope_ids.user_id ,self.__get_xblock_key())

    def __get_xblock_key(self):
        """Return xblock location key

         more info at : https://groups.google.com/forum/#!topic/edx-xblock/78jOyuT0ozA
        Returns:
            KNotes


        """
        return self.scope_ids.usage_id

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("videoknotes",
            """
            <vertical_demo>
                <videoknotes href="http://www.dailymotion.com/video/x2e4j6u" />
            </vertical_demo>
            """)
        ]
