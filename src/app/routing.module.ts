import {NgModule}from '@angular/core';
import {Routes, RouterModule}from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PathComponent } from './pages/search/path/path.component';
import { EditPathComponent } from './pages/path/edit-path.component';
import { SearchComponent } from './pages/search/search.component';
import { ObjectComponent } from './pages/object/object.component';
import { CreateTagComponent } from './pages/cteatetag/create-tag.component';
import { SetObjectComponent } from './pages/set-object/set-object.component';

import { ChannelSearchComponent } from './pages/search/components/channel-search.component';
import { MediaSearchComponent } from './pages/search/components/media-search.component';
import { PathSearchComponent } from './pages/search/components/path-search.component';
import { PersonSearchComponent } from './pages/search/components/person-search.component';
import { SectionSearchComponent } from './pages/search/components/section-search.component';
import { SeriesSearchComponent } from './pages/search/components/series-search.component';
import { TagSearchComponent } from './pages/search/components/tag-search.component';
import { ThemeSearchComponent } from './pages/search/components/theme-search.component';

import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'object/:typeid/:id',
      component: ObjectComponent,
      canActivate: [AuthGuard],
    },    
    {
      path : 'path/:id',
      component: EditPathComponent,
      canActivate: [AuthGuard],
    },
    {
      path : 'path/set-object/:id',
      component: SetObjectComponent,
      canActivate: [AuthGuard],
      children:[
        { path: '', pathMatch: 'full', redirectTo: 'media' },
        //{ path : 'path-url', component: PathComponent },

        { path : 'channel', component: ChannelSearchComponent },
        { path : 'media', component: MediaSearchComponent },
        { path : 'path', component: PathSearchComponent },
        { path : 'person', component: PersonSearchComponent },
        { path : 'section', component: SectionSearchComponent },
        { path : 'series', component: SeriesSearchComponent },
        { path : 'tag', component: TagSearchComponent },
        { path : 'theme', component: ThemeSearchComponent },
      ]      
    },
    {
      path: 'createtag',
      component: CreateTagComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'search',
      component: SearchComponent,
      //data: { title: 'Search' },
      canActivate: [AuthGuard],
      children:[
        //{ path: '', pathMatch: 'full', redirectTo: 'path-url' },
        { path : 'path-url', component: PathComponent },

        { path : 'channel', component: ChannelSearchComponent },
        { path : 'media', component: MediaSearchComponent },
        { path : 'path', component: PathSearchComponent },
        { path : 'person', component: PersonSearchComponent },
        { path : 'section', component: SectionSearchComponent },
        { path : 'series', component: SeriesSearchComponent },
        { path : 'tag', component: TagSearchComponent },
        { path : 'theme', component: ThemeSearchComponent },
      ]
    },
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    { path: '**', redirectTo: '' }
  ];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}