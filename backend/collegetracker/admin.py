from django.contrib import admin
from .models import College, Comment, Post, Bookmark, Reply, User
from django.contrib.auth.admin import UserAdmin


admin.site.register(User)
admin.site.register(College)
admin.site.register(Comment)
admin.site.register(Post)
admin.site.register(Bookmark)
admin.site.register(Reply)
