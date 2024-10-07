from django.contrib.auth.models import User
from django.db import models
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer, RegisterSerializer

# Представление для регистрации пользователей
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        # Проверка на существование пользователя
        if User.objects.filter(username=username).exists():
            return Response({'detail': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        user = User(username=username)
        user.set_password(password)  # Храните пароль в зашифрованном виде
        user.save()
        return Response({'detail': 'User registered successfully.'}, status=status.HTTP_201_CREATED)

# Представление для получения и создания задач
class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Фильтруем задачи по текущему пользователю
        return Task.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Сохраняем задачу с текущим пользователем
        serializer.save(user=self.request.user)

# Представление для получения, обновления и удаления конкретной задачи
class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
