from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from bemygamersite.models import Blog
from bemygamersite.utils import utils
import datetime

def index(request):
    return render(request, "bemygamersite/blog/index.html")

def get(request):
    blogs = Blog.objects.filter(isActive=1)
    blogList = []
    for blog in blogs:
        blogList.append({"id":blog.id, "title":blog.title, "content":blog.content,
                            "publishedDateTime":utils.FormatDateTime(blog.publishedDateTime)})

    return JsonResponse(blogList, safe=False)

def delete(request, id):
    blog = Blog.objects.get(id=id)
    if blog:
        blog.delete()

    return JsonResponse({}, safe=False)

def new(request):
    blog = Blog()
    blog.title = request.GET.get("title", None)
    if utils.IsEmpty(blog.title):
        return utils.JsonErrorField("The title is required.", "title")

    blog.title = blog.title.strip()

    blog.content = request.GET.get("content", None)
    if utils.IsEmpty(blog.content):
        return utils.JsonErrorField("The content is required.", "content")

    blog.content = blog.content.strip()
    blog.publishedDateTime = datetime.datetime.now()
    blog.isActive = 1
    blog.save()

    return JsonResponse({}, safe=False)