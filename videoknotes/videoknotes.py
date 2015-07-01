import pkg_resources

from pprint import pprint

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String

from xblock.fragment import Fragment
from django.contrib.auth.models import User

from opaque_keys.edx.locations import SlashSeparatedCourseKey


from .models import TimecodedComment, TimecodedCommentLine
import json

class VideoKNotesBlock(XBlock):
    """
    An XBlock
    """

    href = String(help="Dailymotion Video", default="x2e4j6u", scope=Scope.content)

    def student_view(self, context):
        """
        Create a fragment used to display the XBlock to a student.
        `context` is a dictionary used to configure the display (unused).

        Returns a `Fragment` object specifying the HTML, CSS, and JavaScript
        to display.
        """

        student = User.objects.get(id=self.scope_ids.user_id)

        comment = None
        #TimecodedComment.objects.get(student=student, block=self.scope_ids.def_id.block_id).delete()
        try:
            comment = TimecodedComment.objects.get(student=student, block=self.scope_ids.def_id.block_id)
        except TimecodedComment.DoesNotExist:
            comment = TimecodedComment(student=student, block=self.scope_ids.def_id.block_id)
            comment.save()

        timecoded_data_set = comment.timecodedcommentline_set.order_by("seconds")
        timecoded_data_array = []
        for timecoded_data in timecoded_data_set:
            obj = {"time_sec": timecoded_data.seconds, "comment":timecoded_data.content, "user":"1", "datetime": "2015-12-10", "is_public": False, "id": timecoded_data.id}
            timecoded_data_array.append(obj)



        # Load the HTML fragment from within the package and fill in the template
        html_str = pkg_resources.resource_string(__name__, "static/html/videoknotes.html")
        frag = Fragment(unicode(html_str).format(self=self, href=self.href, comment_id=comment.pk))

        css_str = pkg_resources.resource_string(__name__, "static/css/style.css")
        frag.add_css(unicode(css_str))

        frag.add_javascript_url("http://api.dmcdn.net/all.js")

        js_annotations_str = pkg_resources.resource_string(__name__, "static/js/KNotesPlugin.js")
        frag.add_javascript(unicode(js_annotations_str))

        js_str = pkg_resources.resource_string(__name__, "static/js/videoknotes.js")
        frag.add_javascript(unicode(js_str))
        frag.initialize_js('VideoKNotesBlock', {"video" : self.href, "notes" : timecoded_data_array})

        js_swfobj_str = pkg_resources.resource_string(__name__, "static/js/swfobject.js")
        frag.add_javascript(unicode(js_swfobj_str))


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
        timecoded = TimecodedComment.objects.get(pk=data.get("comment_id"))
        timecoded_content = TimecodedCommentLine(seconds=data.get('seconds'), content=data.get("content"), timecoded_comment=timecoded)
        timecoded_content.save()
        return {'result': 'success', 'id' : timecoded_content.pk}

    @XBlock.json_handler
    def update_notes(self, data, suffix=''):
        """
        Called upon completion of the video.
        """
        timecoded = TimecodedCommentLine.objects.get(pk=data.get("pk"))
        timecoded.content = data.get("content")
        timecoded.save()

        return {'result': 'success'}


    @XBlock.json_handler
    def delete_notes(self, data, suffix=''):
        """
        Called upon completion of the video.
        """
        timecoded = TimecodedCommentLine.objects.get(pk=data.get("pk"))
        timecoded.delete()
        return {'result': 'success'}

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
