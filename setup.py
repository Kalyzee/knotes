# -*- coding: utf-8 -*-
from setuptools import setup

"""

    This file is part of Knotes.

    Knotes is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Knotes is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Knotes.  If not, see <http://www.gnu.org/licenses/>.

    
    KNote Team (Alphabetical order) : 
        - Stephane Barbati  <stephane.barbati@kalyzee.com>
        - Ludovic Bouguerra <ludovic.bouguerra@kalyzee.com>
        - Anthony Gross     <anthony.gross@kalyzee.com>
        - Guillaume Laurie  <guillaume.laurie34@gmail.com>
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
