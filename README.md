# KNotes

This XBLock allows student taking notes from video. 

![](http://www.kalyzee.com/wp-content/uploads/2015/06/CGQ-VDNWgAAYd3F.png)

This readme explains how to deploy KNotes in devstack environment. We assume you have latest devstack from edx installed and vagrant configured (and launched). More information available at : https://github.com/edx/configuration/wiki/edX-Developer-Stack

# Installation guide

Connect you to your VM with :
```
vagrant ssh.
```

Connect you with edxapp user

```
sudo su edxapp
```

Now we are going to create an apps directory in /edx/app/edxapp which will store the knotes app
- In /edx/app/edxapp with edxapp user create a directory my-apps

``` 
 cd /edx/app/edxapp
 mkdir my-apps
 cd my-apps
```

Now we will clone the knotes github repository in /edx/app/edxapp/my-apps
``` 
git clone https://github.com/Kalyzee/knotes.git
``` 

We activate the openedx venv and installing knotes
```
source /edx/app/edxapp/venvs/edxapp/bin/activate
cd knotes
pip install -r requirements.txt
```

## Database configuration / installation

You have to add into edx settings file 
 
For dev environment you have to add at the end of /edx/app/edxapp/edx-platform/cms/envs/devstack.py and  /edx/app/edxapp/edx-platform/lms/envs/devstack.py

```python

INSTALLED_APPS += ('videoknotes',)

```

After that it's necessary to setup database.

```
cd /edx/app/edxapp/edx-platform
./manage.py lms syncdb --settings=devstack
```

The first output's lines will looks like that :

Syncing...
Creating tables ...
Creating table videoknotes_knotelist
Creating table videoknotes_knote
Installing custom SQL ...
Installing indexes ...
Installed 0 object(s) from 0 fixture(s)


Restart your edx
```
 cd /edx/app/edxapp/edx-platform
 paver devstack --fast studio
```
## Enabling in Studio

Login 

To enable this KNotes into your course you have to :
  - On a studio course main page go to Setting > Advanced Settings.
  
![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-advanced-setting-enabling-knotes.png)

  - Into the advanced module part, add "videoknotes" into the array.

  
![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-advanced-setting-enabling-knotes-in-form.png)

  - Click on "Save changes"

![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-knotes-visual-feedback-installation.png)

## Using Knotes 
In a unit : 

![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-knotes-usage-plugin-selection.png)

Click on the advanced button in add new component.

![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-knotes-selection-unit.png)

Click on videoknotes

![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-knotes-preview.png)

Your KNote is fully loaded you can change your video by cliking on edit button on the top right of the previous picture.

![](http://www.kalyzee.com/wp-content/uploads/2015/09/edx-knotes-select-video-url.png)

In this version Youtube and Dailymotion are enable it's possible to develop another player components.

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
  /**
  * Must return true if the videoURL is compatible !
  */
}

PlayerFactory.registerPlayer(MyPlayerAdapter);
```

