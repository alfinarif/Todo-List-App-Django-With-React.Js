
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='api-index'),
    path('list/', views.taskList, name='list'),
    path('create/', views.taskCreate, name='create'),
    path('update/<int:pk>/', views.taskUpdate, name='update'),
    path('delete/<int:pk>/', views.taskDelete, name='delete'),
]
