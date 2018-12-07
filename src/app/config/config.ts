import { InjectionToken, Injectable } from '@angular/core';

export const APP_API_URLS = new InjectionToken<string>('app.config');

export const Urls = {    
    AUTH_ROOT: 'https://api.newstube.ru/v2',
    AUTH_CHECK: '/Auth/Check',
    AUTH_LOGIN: '/Auth/Login',

    ROOT: 'https://api.newstube.ru/urldev',
    META_GET_META: '/Meta/GetMeta',
    PATH_GET_BY_URL: '/Path/GetByUrl',
    PATH_GET_BY_PATH_ID_DETAIL: '/Path/GetByPathIdDetail',
    PATH_GET_BY_OBJECT_DETAIL: '/Path/GetByObjectDetail',
    PATH_UPDATE: '/Path/Update',
    PATH_SET_OBJECT: '/Path/SetObject',
    PATH_DELETE: '/Path/Delete',
    PATH_LATIN: '/Path/Latin',
    PATH_MEDIAS_ADD: '/Path/MediasAdd',
    PATH_MEDIAS_REMOVE: '/Path/MediasRemove',
    PATH_MEDIAS_CLEAR: '/Path/MediasClear',
    PATH_PARENTS: '/Path/Parents',
    PATH_CREATE_REDIRECT: '/Path/CreateRedirect',
    PATH_CREATE_REDIRECT_MANY: '/Path/CreateRedirectMany',

    TAG_CREATE: '/Tag/Create',
    TAG_DELETE: '/Tag/Delete',
    TAG_DELETE_MANY: '/Tag/DeleteMany',
    TAG_MOVE_AND_DELETE: '/Tag/MoveAndDelete',
    TAG_MOVE_AND_DELETE_MANY:'/Tag/MoveAndDeleteMany',

    CHANNEL_SEARCH: '/Channel/Search',
    MEDIA_SEARCH: '/Media/Search',
    THEME_SEARCH: '/Theme/Search',
    PERSON_SEARCH: '/Person/Search',
    TAG_SEARCH: '/Tag/Search',
    SECTION_SEARCH: '/Section/Search',
    SERIES_SEARCH: '/Series/Search',
    PATH_SEARCH: '/Path/Search',

    CHANNEL_SEARCH_COUNT: '/Channel/SearchCount',
    MEDIA_SEARCH_COUNT: '/Media/SearchCount',
    THEME_SEARCH_COUNT: '/Theme/SearchCount',
    PERSON_SEARCH_COUNT: '/Person/SearchCount',
    TAG_SEARCH_COUNT: '/Tag/SearchCount',
    SECTION_SEARCH_COUNT: '/Section/SearchCount',
    SERIES_SEARCH_COUNT: '/Series/SearchCount',
    PATH_SEARCH_COUNT: '/Path/SearchCount',
}