from django.db import models
from django.contrib.auth.models import User

class KNote(models.Model):
    class Meta:
        unique_together = (("user", "block"),)

    user = models.ForeignKey(User)
    block = models.CharField(max_length=255)
        
class KNoteList(models.Model):
    timecoded_comment = models.ForeignKey(KNote)
    seconds = models.IntegerField(default=0)
    content = models.TextField()
    is_public = models.BooleanField(default=False)