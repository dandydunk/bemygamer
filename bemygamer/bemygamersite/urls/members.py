from django.urls import path
from bemygamersite.views.members import *
from django.urls import include, re_path

urlpatterns = [
    path('login/<loginToken>/', login),
    path('status/', status),
    path('logout/', logout),
    path('register/', register),
    re_path(r'^saveProfile/(?P<profile>.+)/$', saveProfile),
    path('savePhotos/', savePhotos),
    path('getSessionMemberPhotos/', getSessionMemberPhotos),
    path('getNextMatch/', getNextMatch),
    path('saveChatMessage/<int:chatMemberId>/<message>/', saveChatMessage),
    path('publishChatMessage/<int:chatMemberId>/', publishChatMessage),
    path('getMessages/<int:chatMemberId>/<int:indexStartId>/', getMessages),
    path('getProfileById/<int:memberId>/', getProfileById),
    path('getLatestInboxMessages/', getLatestInboxMessages),
    path('getLatestLikedMembers/', getLatestLikedMembers),
    path('likeMemberAndGetNextMatch/<int:memberIdToLike>/', likeMemberAndGetNextMatch),
    path('skipMemberAndGetNextMatch/<int:memberIdToLike>/', skipMemberAndGetNextMatch)
]