from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets
from smartmanager_django.crud.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]