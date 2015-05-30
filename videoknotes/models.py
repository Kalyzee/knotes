from django.db import models
from django.contrib.auth.models import User


class TimecodedComment(models.Model):
    class Meta:
        unique_together = (("student", "block"),)

    student = models.ForeignKey(User)
    block = models.CharField(max_length=255)
        
class TimecodedCommentLine(models.Model):
    timecoded_comment = models.ForeignKey(TimecodedComment)
    seconds = models.IntegerField(default=0)
    content = models.TextField()
    