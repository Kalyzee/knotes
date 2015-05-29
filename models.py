from django.db import models

class TimecodedComment(models.Model):
    student_module = models.ForeignKey(StudentModule)
        
class TimecodedCommentLine(models.Model):
    timecoded_comment = models.ForeignKey(TimecodedComment)
    seconds = models.IntegerField(default=0)
    content = models.TextField()
    