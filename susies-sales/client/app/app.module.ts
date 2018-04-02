import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { RoutingModule } from "./routing.module";
import { SharedModule } from "./shared/shared.module";
import { PostService } from "./services/post.service";
import { UserService } from "./services/user.service";
import { AuthService } from "./services/auth.service";
import { AuthGuardLogin } from "./services/auth-guard-login.service";
import { AuthGuardAdmin } from "./services/auth-guard-admin.service";
import { AppComponent } from "./app.component";
import { PostsComponent } from "./Posts/posts.component";
import { AboutComponent } from "./about/about.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { AccountComponent } from "./account/account.component";
import { AdminComponent } from "./admin/admin.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { HttpClientModule } from "@angular/common/http";
import { EditPostComponent } from "./Posts/edit-post.component";
import { PostComponent } from "./shared/post.component";
import { ReactiveFormsModule } from "@angular/forms";
import { RctPostComponent } from "./rct-post/rct-post.component";
import { ViewPostComponent } from "./rct-post/view-post.component";
import { CarouselComponent } from "./rct-post/carousel.component";
import { NgxSiemaModule } from "ngx-siema";
import { GimmieService } from "./services/gimmie.service";
import { UserPostsComponent } from "./Posts/user-posts.component";
import { NgxSmartModalModule, NgxSmartModalService } from "ngx-smart-modal";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CalendarControlComponent } from "./shared/calendar-control/calendar-control.component";
import {
  MatTableModule,
  MatCheckboxModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatFormFieldModule
} from "@angular/material";
import { DlDateTimePickerDateModule } from "angular-bootstrap-datetimepicker";
import { PrivateMessageService } from "./services/private-message.service";
import { PrivateMessagesComponent } from "./private-messages/private-messages.component";

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
    ViewPostComponent,
    CarouselComponent,
    UserPostsComponent,
    CalendarControlComponent,
    PrivateMessagesComponent
  ],
  imports: [
    RoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxSiemaModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    BrowserAnimationsModule,
    MatTableModule,
    MatCheckboxModule,
    DlDateTimePickerDateModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule
  ],
  providers: [
    AuthService,
    AuthGuardLogin,
    AuthGuardAdmin,
    PostService,
    GimmieService,
    UserService,
    HttpClientModule,
    NgxSmartModalService,
    PrivateMessageService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {}
