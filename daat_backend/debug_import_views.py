import os
import django
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'daat_backend.settings')
django.setup()

try:
    from diagnostic import views
    print("Successfully imported diagnostic.views")
    if hasattr(views, 'check_status'):
        print("check_status EXISTS")
    else:
        print("check_status NOT FOUND")
        print("Available attributes:")
        print([x for x in dir(views) if not x.startswith('__')])
except Exception as e:
    print(f"Import Failed: {e}")
    import traceback
    traceback.print_exc()
