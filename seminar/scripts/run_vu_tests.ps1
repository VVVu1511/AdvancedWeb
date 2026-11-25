$ErrorActionPreference = 'Stop'
$env:PYTHONPATH = '.'
python -m unittest discover -s tests -v
