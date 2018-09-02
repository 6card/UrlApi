import {NgModule}from '@angular/core';
import {Routes, RouterModule}from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TagComponent } from './pages/search/tag/tag.component';
import { PathComponent } from './pages/search/path/path.component';
import { SearchComponent } from './pages/search/search.component';

import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },

    {
      path: 'search',
      component: SearchComponent,
      //data: { title: 'Search' },
      canActivate: [AuthGuard],
      children:[
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'path'
        },
        {
         path : 'path',
         component: PathComponent
        },
        {
          path : 'tag',
          component: TagComponent
         },
        {
          path : 'dashboard',
          component: DashboardComponent
         },
      ]
    },
    {
      path: '',
      redirectTo: 'search',
      pathMatch: 'full'
    },
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