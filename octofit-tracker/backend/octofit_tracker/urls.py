"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from django.urls import path, include
from django.http import JsonResponse
import os
from rest_framework import routers, serializers, viewsets
from django.apps import apps

# Serializers e ViewSets dinâmicos para cada coleção
client = None
try:
    from pymongo import MongoClient
    client = MongoClient('localhost', 27017)
    db = client['octofit_db']
except Exception:
    db = None

from bson import ObjectId
def convert_objectid(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_objectid(i) for i in obj]
    return obj

def build_viewset(collection):
    class GenericSerializer(serializers.Serializer):
        def to_representation(self, instance):
            return instance

    class GenericViewSet(viewsets.ViewSet):
        serializer_class = GenericSerializer
        def list(self, request):
            items = list(db[collection].find({})) if db else []
            items = convert_objectid(items)
            return JsonResponse(items, safe=False)
    return GenericViewSet

router = routers.DefaultRouter()
for comp in ['users', 'activities', 'teams', 'leaderboard', 'workouts']:
    router.register(comp, build_viewset(comp), basename=comp)

def api_root(request):
    codespace_name = os.environ.get('CODESPACE_NAME', 'localhost')
    if codespace_name != 'localhost':
        base_url = f"https://{codespace_name}-8000.app.github.dev"
    else:
        base_url = "http://localhost:8000"
    return JsonResponse({
        'activities': f'{base_url}/api/activities/',
        'users': f'{base_url}/api/users/',
        'teams': f'{base_url}/api/teams/',
        'leaderboard': f'{base_url}/api/leaderboard/',
        'workouts': f'{base_url}/api/workouts/',
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),
    path('api/', include(router.urls)),
]
