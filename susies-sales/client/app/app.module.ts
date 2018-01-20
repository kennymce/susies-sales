import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
import { PostService } from './services/post.service';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { AuthGuardLogin } from './services/auth-guard-login.service';
import { AuthGuardAdmin } from './services/auth-guard-admin.service';
import { AppComponent } from './app.component';
import { PostsComponent } from './Posts/posts.component';
import { AboutComponent } from './about/about.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AccountComponent } from './account/account.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { EditPostComponent } from './Posts/edit-post.component';
import { PostComponent } from './shared/post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RctPostComponent } from './rct-post/rct-post.component';
import {ViewPostComponent} from './rct-post/view-post.component';


@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    AboutComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    AccountComponent,
    AdminComponent,
    NotFoundComponent,
    EditPostComponent,
    PostComponent,
    RctPostComponent,
    ViewPostComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    PostService,
    UserService,
    HttpClientModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})

export class AppModule { }
