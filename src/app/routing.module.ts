import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { EditPathComponent } from './pages/path/path.component';
import { SearchComponent } from './pages/search/search.component';
import { ObjectComponent } from './pages/object/object.component';
import { CreateTagComponent } from './pages/cteatetag/create-tag.component';
import { SetObjectComponent } from './pages/set-object/set-object.component';

import { MoveTagsComponent } from './pages/movetags/move-tags.component';
import { BatchRedirectComponent } from './pages/batch-redirect/batch-redirect.component';

import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'object/:typeid/:id', component: ObjectComponent, canActivate: [AuthGuard] },
    { path : 'path/:id', component: EditPathComponent, canActivate: [AuthGuard] },
    { path : 'path/set-object/:id', component: SetObjectComponent, canActivate: [AuthGuard] },
    { path: 'createtag', component: CreateTagComponent, canActivate: [AuthGuard] },
    { path: 'movetags', component: MoveTagsComponent, canActivate: [AuthGuard] },
    { path: 'batch-redirect', component: BatchRedirectComponent, canActivate: [AuthGuard] },
    { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'search', pathMatch: 'full' },
    { path: '**', redirectTo: '' },
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
