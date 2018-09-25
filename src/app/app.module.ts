import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./routing.module";
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './pages/login/login.component';
import { ObjectComponent } from './pages/object/object.component';
import { SearchComponent } from './pages/search/search.component';
import { SearchPathComponent } from './components/search-path/search-path.component';
import { EditPathComponent } from './pages/path/path.component';
import { CreateTagComponent } from './pages/cteatetag/create-tag.component';
import { SetObjectComponent } from './pages/set-object/set-object.component';

import { CommonSearchComponent } from './components/common-search/common-search.component';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchSubFormComponent } from './components/search-sub-from/search-sub-from.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AlertComponent } from './components/alert/alert.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { TagFormComponent } from './components/tag-form/tag-from.component';

import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SearchComponent,
    NavigationComponent,
    SearchPathComponent,
    EditPathComponent,
    CreateTagComponent,
    SetObjectComponent,
    
    CommonSearchComponent,
    ObjectComponent,
    SearchFormComponent,
    SearchSubFormComponent,
    SearchTableComponent,
    PaginationComponent,
    AlertComponent,
    DialogComponent,
    TagFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ClarityModule,
    ClrFormsNextModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    CookieService,
    AlertService
    //PathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
