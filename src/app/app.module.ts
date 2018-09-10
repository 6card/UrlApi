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
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { SidenavComponent } from './pages/sidenav/sidenav.component';
import { ObjectComponent } from './pages/object/object.component';
import { SearchComponent } from './pages/search/search.component';
import { PathComponent } from './pages/search/path/path.component';
import { EditPathComponent } from './pages/search/path/edit-path.component';
import { TagComponent } from './pages/search/tag/tag.component';

import { AuthenticationService } from './services/auth.service';
import { PathService } from './services/path.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    SidenavComponent,
    SearchComponent,
    NavigationComponent,
    PathComponent,
    EditPathComponent,
    TagComponent,
    ObjectComponent
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
    PathService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
