import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostsComponent } from "./Posts/posts.component";
import { AboutComponent } from "./about/about.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { LogoutComponent } from "./logout/logout.component";
import { AccountComponent } from "./account/account.component";
import { AdminComponent } from "./admin/admin.component";
import { AuthGuardLogin } from "./services/auth-guard-login.service";
import { AuthGuardAdmin } from "./services/auth-guard-admin.service";
import { RctPostComponent } from "./rct-post/rct-post.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ViewPostComponent } from "./rct-post/view-post.component";
import { UserPostsComponent } from "./Posts/user-posts.component";
import { PrivateMessagesComponent } from "./private-messages/private-messages.component";
import { NewsComponent } from "./News/news.component";

const routes: Routes = [
  { path: "", component: AboutComponent },
  { path: "posts", component: PostsComponent },
  { path: "user-posts", component: UserPostsComponent },
  { path: "privateMessages", component: PrivateMessagesComponent },
  { path: "rct-post/rct-post", component: RctPostComponent },
  { path: "rct-post/view-post", component: ViewPostComponent },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  {
    path: "account",
    component: AccountComponent,
    canActivate: [AuthGuardLogin]
  },
  { path: "admin", component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: "news", component: NewsComponent, canActivate: [AuthGuardAdmin] },
  { path: "notfound", component: NotFoundComponent },
  { path: "**", redirectTo: "/notfound" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutingModule {}
