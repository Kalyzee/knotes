# KNotes

This XBLock allows student taking notes from video. 

![](http://www.kalyzee.com/wp-content/uploads/2015/06/CGQ-VDNWgAAYd3F.png)

# Installation guide

In /edx/app/edxapp with edxapp user create a directory my-apps

In /edx/app/edxapp/my-apps
git clone https://github.com/Kalyzee/knotes.git

source /edx/app/edxapp/venvs/bin/activate

cd knotes


To install this plugin you need to be in the python virtual environement of your edx-platform and execute this command from this Xblock folder

```
$ pip install -r requirements.txt
```

## Database configuration / installation

You have to add into edx settings file 
 
 
For dev environment you have to add at the end of /edx/app/edxapp/edx-platform/cms/envs/devstack.py and  /edx/app/edxapp/edx-platform/cms/envs/devstack.py

```python

INSTALLED_APPS += ('videoknotes',)

```

After that it's necessary to setup database.

```
./manage.py lms syncdb --settings=devstack
```

Restart your edx

## Enabling in Studio

To enable this KNotes into your course you have to :
  - On a studio course main page go to Setting > Advanced Settings.
  - Into the advanced module part, add "videoknotes" into the array.
  - Click on "Save changes"

## Developping player adapters

```
function MyPlayerAdapter(element, video){


    var listeners = new KNotesListener(),
        _this = this;

    this.getCurrentTime = function(){

    }

    this.play = function(){

    }

    this.pause = function(){

    }

    this.seek = function(time){

    }

    this.createPlayerView = function(){

    }

    this.onTimeUpdate = function(callback){
      listeners.addlisteners("onTimeUpdate", callback);
    }

    var fireTimeUpdate = function(time){
      listeners.fireListeners("onTimeUpdate", function(callback){
        callback(time);
      });
    }

}


MyPlayerAdapter.isCompatible = function(videoURL){

}
```

