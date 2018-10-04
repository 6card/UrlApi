import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AutocompleteModule } from './components/test/autocomplete.module';

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./routing.module";
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
import { TagFormComponent } from './components/tag-form/tag-from.component';
//import { AutocompleteComponent } from './components/test/autocomplete.component';
//import { AutocompleteWindowComponent } from './components/test/autocomplete-window.component';
import { SortableColumnComponent } from './components/search-table/sortable-column.component'

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
    TagFormComponent,
    
    //AutocompleteComponent,
    //AutocompleteWindowComponent,
    SortableColumnComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AutocompleteModule
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
