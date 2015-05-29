import pkg_resources

from xblock.core import XBlock
from xblock.fields import Scope, Integer, String

from xblock.fragment import Fragment

class VideoKNotesBlock(XBlock):
    """
    An XBlock 
    """

    href = String(help="Dailymotion Video", default=None, scope=Scope.content)

    def student_view(self, context):
        """
        Create a fragment used to display the XBlock to a student.
        `context` is a dictionary used to configure the display (unused).

        Returns a `Fragment` object specifying the HTML, CSS, and JavaScript
        to display.
        """
        # Load the HTML fragment from within the package and fill in the template
        html_str = pkg_resources.resource_string(__name__, "static/html/videoknotes.html")
        frag = Fragment(unicode(html_str).format(self=self, href=self.href))

        css_str = pkg_resources.resource_string(__name__, "static/css/style.css")
        frag.add_css(unicode(css_str))

        js_annotations_str = pkg_resources.resource_string(__name__, "static/js/annotations.js")
        frag.add_javascript(unicode(js_annotations_str))

        js_player_str = pkg_resources.resource_string(__name__, "static/js/player.js")
        frag.add_javascript(unicode(js_player_str))

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
