from setuptools import setup

setup(
    name='xblock-videoknotes',
    version='0.2',
    description='Video notes',
    py_modules=['videoknotes'],
    install_requires=['XBlock'],
    entry_points={
        'xblock.v1': [
            'videoknotes = videoknotes.videoknotes:VideoKNotesBlock',
        ]
    }
)
