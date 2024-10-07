from django.contrib.auth.models import User
from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=255)  # ��������� ������
    description = models.TextField()           # �������� ������
    created_at = models.DateTimeField(auto_now_add=True)  # ���� � ����� �������� ������
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # ����� � �������������

    def __str__(self):
        return self.title  # ���������� ��������� ������ ��� ������ str
