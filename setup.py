# -*- coding: utf-8 -*-
from setuptools import setup


"""
    KNote by Kalyzee

    Xblock for openedx plateform which allow students taking notes from video. 

    
    KNote Team (In alphabetical order) : 
        - Stephane Barbati  <stephane.barbati@kalyzee.com>
        - Ludovic Bouguerra <ludovic.bouguerra@kalyzee.com>
        - Anthony Gross     <anthony.gross@kalyzee.com>
        - Guillaume Laurie  <anthony.gross@kalyzee.com>
        - Christian Surace  <christian.surace@kalyzee.com>        
        
        
"""


setup(
    name='xblock-videoknotes',
    version='0.2',
    description='Video notes',
    py_modules=['videoknotes'],
    author='Stephane Barbati, Ludovic Bouguerra, Anthony Gross, Guillaume Laurie, Christian Surace',
    author_email='stephane.barbati@kalyzee.com, ludovic.bouguerra@kalyzee.com, anthony.gross@kalyzee.com, guillaume.laurie34@gmail.com, christian.surace@kalyzee.com',    
    install_requires=['XBlock'],
    entry_points={
        'xblock.v1': [
            'videoknotes = videoknotes.videoknotes:VideoKNotesBlock',
        ]
    }
)
