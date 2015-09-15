from django.db import models
from django.contrib.auth.models import User

class KNoteList(models.Model):
    class Meta:
        unique_together = (("user", "block"),)

    user = models.ForeignKey(User)
    block = models.CharField(max_length=255)
        
class KNote(models.Model):
    timecoded_comment = models.ForeignKey(KNoteList)
    seconds = models.IntegerField(default=0)
    content = models.TextField()
    is_public = models.BooleanField(default=False)