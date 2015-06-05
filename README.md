# xblock-videoannotation

This XBLock allows student taking notes from video. 

![](http://www.kalyzee.com/wp-content/uploads/2015/06/CGQ-VDNWgAAYd3F.png)

# Installation guide

To install this plugin you need to be in the python virtual environement of your edx-platform and execute this command from this Xblock folder

```
$ pip install -r requirements.txt
```

## Database configuration / installation

You have to add into edx settings file 
 
```python

INSTALLED_APPS += ('videoknotes',)

```

After that it's necessary to setup database.

```
./manage.py syncdb
```

## Enabling in Studio

To enable this KNotes into your course you have to :
  - On a studio course main page go to Setting > Advanced Settings.
  - Into the advanced module part, add "videoknotes" into the array.
  - Click on "Save changes"

## Developping player adapters

