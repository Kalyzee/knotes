from setuptools import setup

setup(
    name='xblock-videoannotation',
    version='0.1',
    description='Video annotation',
    py_modules=['videoannotation'],
    install_requires=['XBlock'],
    entry_points={
        'xblock.v1': [
            'videoannotation = videoannotation:VideoAnnotationBlock',
        ]
    }
)
