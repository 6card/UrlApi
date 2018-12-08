import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from "./routing.module";

/* MODALS */
import { SetObjectModalComponent } from './modals/set-object/set-object-modal.component';
import { AddMediasModalComponent } from './modals/add-medias/add-medias-modal.component';
import { AddRedirectModalComponent } from './modals/add-redirect/add-redirect-modal.component';
import { MoveTagModalComponent } from './modals/move-tag/move-tag-modal.component';
import { MoveTagsModalComponent } from './modals/move-tag/move-tags-modal.component';
import { BatchRedirectModalComponent } from './modals/batch-redirect/batch-redirect-modal.component';

/* PAGES */
import { LoginComponent } from './pages/login/login.component';
import { ObjectComponent } from './pages/object/object.component';
import { SearchComponent } from './pages/search/search.component';
import { SearchPathComponent } from './components/search-path/search-path.component';
import { EditPathComponent } from './pages/path/path.component';
import { CreateTagComponent } from './pages/cteatetag/create-tag.component';
import { SetObjectComponent } from './pages/set-object/set-object.component';
import { MoveTagsComponent } from './pages/movetags/move-tags.component';
import { BatchRedirectComponent } from './pages/batch-redirect/batch-redirect.component';

/* COMPONENTS */
import { AutocompleteModule } from './components/autocomplete/autocomplete.module';
import { DtpickerModule } from './components/dtpicker/dtpicker.module';
import { CommonSearchComponent } from './components/common-search/common-search.component';
import { NavigationComponent } from "./components/navigation/navigation.component";
import { SearchFormComponent } from './components/search-form/search-form.component';
import { SearchSubFormComponent } from './components/search-sub-from/search-sub-from.component';
import { SearchTableComponent } from './components/search-table/search-table.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { AlertComponent } from './components/alert/alert.component';
import { TagFormComponent } from './components/tag-form/tag-from.component';
import { SortableColumnComponent } from './components/search-table/sortable-column.component';
import { LoadingDirective, BtnLoadingDirective } from './components/search-table/loading.directive';

/* SERVICES */
import { AuthenticationService } from './services/auth.service';
import { AlertService } from './services/alert.service';
import { AuthGuard } from './guards/auth.guard';
import { APP_CONST, Constants } from './config/const';
import { APP_API_URLS, Urls } from './config/config';

@NgModule({
  declarations: [
    AppComponent,

    /* PAGES */
    LoginComponent,
    SearchComponent,
    NavigationComponent,
    SearchPathComponent,
    EditPathComponent,
    CreateTagComponent,
    SetObjectComponent,
    MoveTagsComponent,
    BatchRedirectComponent,

    /* COMPONENTS */
    CommonSearchComponent,
    ObjectComponent,
    SearchFormComponent,
    SearchSubFormComponent,
    SearchTableComponent,
    PaginationComponent,
    AlertComponent,
    TagFormComponent,
    SortableColumnComponent,
    LoadingDirective,
    BtnLoadingDirective,
    
    /* MODALS */
    SetObjectModalComponent,
    AddMediasModalComponent,
    AddRedirectModalComponent,
    MoveTagModalComponent,
    MoveTagsModalComponent,
    BatchRedirectModalComponent,    
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AutocompleteModule.forRoot(),
    DtpickerModule.forRoot()
  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    CookieService,
    AlertService,
    { provide: APP_CONST, useValue: Constants },
    { provide: APP_API_URLS, useValue: Urls }
  ],
  entryComponents: [
    SetObjectModalComponent, 
    AddMediasModalComponent, 
    AddRedirectModalComponent, 
    MoveTagModalComponent, 
    MoveTagsModalComponent,
    BatchRedirectModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
