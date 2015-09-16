import pkg_resources

from pprint import pprint

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String

from xblock.fragment import Fragment
from django.contrib.auth.models import User

import csv
from webob import Response

from .models import KNoteList, KNote
import json
import functools

class VideoKNotesBlock(XBlock):
    """
    VideoKNotesBlock allows the users to create comments timecoded (means comments can be located in time).
    Users can export all visible comments as CSV.
    Owners can share their comment when they mark them as public.
    Student can comment as private.
    """

    href = String(help="Dailymotion Video", default="x2e4j6u", scope=Scope.content)

    def student_view(self, context):
        """
        Show all knotes for the current user and the owner(s) which are in public state.
        """

        student = User.objects.get(id=self.scope_ids.user_id)

        comment = None
        #KNoteList.objects.get(student=student, block=self.scope_ids.def_id.block_id).delete()
        """ Try to find the last KnoteList or create one """
        try:
            comment = KNoteList.objects.get(user=student, block=self.scope_ids.def_id.block_id)
        except KNoteList.DoesNotExist:
            comment = KNoteList(user=student, block=self.scope_ids.def_id.block_id)
            comment.save()
            
	"""Find all knotes ordered by seconds"""
	
        timecoded_data_set = comment.knote_set.order_by("seconds")
        timecoded_data_array = []
        for timecoded_data in timecoded_data_set:
        	"""Convert Knote objects (python) to Knote objects (Javascript) """
        	
        	obj = {"time": timecoded_data.seconds, "value":timecoded_data.content, "user": self.scope_ids.user_id , "datetime": "2015-12-10", "is_public": False, "id": timecoded_data.id}
        	timecoded_data_array.append(obj)



        # Load the HTML fragment from within the package and fill in the template
        html_str = pkg_resources.resource_string(__name__, "static/html/videoknotes.html")
        frag = Fragment(unicode(html_str).format(self=self, href=self.href, comment_id=comment.pk))

        css_str = pkg_resources.resource_string(__name__, "static/css/style.css")
        frag.add_css(unicode(css_str))

        frag.add_javascript_url("http://api.dmcdn.net/all.js")
        frag.add_javascript_url("https://www.youtube.com/iframe_api")


        javascript_array = ["static/js/core/KNotesListener.js", "static/js/core/KNote.js", 
            "static/js/core/KNotesIterator.js", "static/js/core/KNotesList.js", "static/js/players/DailymotionAdapter.js",
            "static/js/players/YoutubeAdapter.js", "static/js/players/PlayerFactory.js",
            "static/js/core/KNotesView.js", "static/js/core/KNotesPlugin.js", 
            "static/vendors/swfobject.js"]

        for element in javascript_array:
            js_str = pkg_resources.resource_string(__name__, element)
            frag.add_javascript(unicode(js_str))

        js_str = pkg_resources.resource_string(__name__, "static/js/videoknotes.js")
        frag.add_javascript(unicode(js_str))
        frag.initialize_js('VideoKNotesBlock', {"video" : self.href, "notes" : timecoded_data_array})


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
        student = User.objects.get(id=self.scope_ids.user_id)
        timecoded = KNoteList.objects.get(user=student, block=self.scope_ids.def_id.block_id)

        if (timecoded.user.pk == self.scope_ids.user_id):
            timecoded_content = KNote(seconds=data.get('seconds'), content=data.get("content"), timecoded_comment=timecoded)
            timecoded_content.save()            
            return {'result': 'success', 'id' : timecoded_content.pk}
        else: 
            return {'error': 'bad credential'}


    @XBlock.json_handler
    def update_notes(self, data, suffix=''):
        """
        Called upon completion of the video.
        """
        timecoded = KNote.objects.get(pk=data.get("pk"))
        if (timecoded.timecoded_comment.user.pk == self.scope_ids.user_id):
            timecoded.content = data.get("content")
            timecoded.save()
            return {'result': 'success'}
        else :
            return {'error': 'bad credential'}


    @XBlock.json_handler
    def delete_notes(self, data, suffix=''):
        """
        Called upon completion of the video.
        """
        timecoded = KNote.objects.get(pk=data.get("pk"))
        if (timecoded.timecoded_comment.user.pk == self.scope_ids.user_id):
            timecoded.delete()
            return {'result': 'success'}
        else:
            return {'error': 'bad credential'}
        
    @XBlock.handler
    def export_notes(self, request, suffix=''):
        """
        Called upon completion of the video.
        """
        student = User.objects.get(id=self.scope_ids.user_id)

        comment = None
        #KNoteList.objects.get(student=student, block=self.scope_ids.def_id.block_id).delete()
        """ Try to find the last KnoteList or create one """
        try:
            comment = KNoteList.objects.get(user=student, block=self.scope_ids.def_id.block_id)
        except KNoteList.DoesNotExist:
            comment = KNoteList(user=student, block=self.scope_ids.def_id.block_id)
            comment.save()

        res = Response()
        res.headerlist = [('Content-type', 'application/force-download'), ('Content-Disposition', 'attachment; filename=%s' % str(self.scope_ids.user_id)+".csv")]
        writer = csv.writer(res)
        
        timecoded_data_set = comment.knote_set.order_by("seconds")
        timecoded_data_array = []
        for timecoded_data in timecoded_data_set:
        	if (timecoded_data.timecoded_comment.user.pk == self.scope_ids.user_id):
        		writer.writerow([timecoded_data.seconds, timecoded_data.content, self.scope_ids.user_id , timecoded_data.id])
        
        return res

    @staticmethod
    def workbench_scenarios():
        """A canned scenario for display in the workbench."""
        return [
            ("videoknotes",
            """
            <vertical_demo>
                <videoknotes href="https://vimeo.com/46100581" />
            </vertical_demo>
            """)
        ]
