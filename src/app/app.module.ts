import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';

import { AppRoutingModule } from "./routing.module";
import { ClarityModule, ClrFormsNextModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavigationComponent } from "./pages/navigation/navigation.component"
import { LoginComponent } from './pages/login/login.component';
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { ObjectComponent } from './pages/object/object.component';
import { SearchComponent } from './pages/search/search.component';
import { PathComponent } from './pages/search/path/path.component';
import { EditPathComponent } from './pages/path/edit-path.component';
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
import { SearchFormComponent } from './shared/search-form.component';
import { SearchTableComponent } from './shared/search-table.component';
import { PaginationComponent } from './shared/pagination.component';

import { AuthenticationService } from './services/auth.service';
//import { PathService } from './services/path.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SidenavComponent,
    SearchComponent,
    NavigationComponent,
    PathComponent,
    EditPathComponent,
    CreateTagComponent,
    SetObjectComponent,

    ChannelSearchComponent,
    MediaSearchComponent,
    PathSearchComponent,
    PersonSearchComponent,
    SectionSearchComponent,
    SeriesSearchComponent,
    TagSearchComponent,
    ThemeSearchComponent,
    ObjectComponent,
    SearchFormComponent,
    SearchTableComponent,
    PaginationComponent
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
    //PathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
