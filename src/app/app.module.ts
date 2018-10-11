import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { DtpickerModule } from './components/dtpicker/dtpicker.module';

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
import { TestComponent } from './pages/test.component';

import { CommonSearchComponent } from './components/common-search/common-search.component';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchSubFormComponent } from './components/search-sub-from/search-sub-from.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AlertComponent } from './components/alert/alert.component';
import { TagFormComponent } from './components/tag-form/tag-from.component';
//import { AutocompleteComponent } from './components/test/autocomplete.component';
import { NgbDateTimePicker } from './components/datetimepiker/datetimepicker.component';
import { SortableColumnComponent } from './components/search-table/sortable-column.component';
import { LoadingDirective } from './components/search-table/loading.directive';

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
    TestComponent,
    
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
    NgbDateTimePicker,
    SortableColumnComponent,
    LoadingDirective
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    AutocompleteModule,
    DtpickerModule.forRoot()
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
