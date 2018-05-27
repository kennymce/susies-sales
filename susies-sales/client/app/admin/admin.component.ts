import { Component, OnInit } from "@angular/core";
import { ToastComponent } from "../shared/toast/toast.component";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { User } from "../shared/models/user.model";
import { IAdminAction } from "./Admin";
import { Router } from "@angular/router";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html"
})
export class AdminComponent implements OnInit {
  authorisedUsers: User[] = [];
  unauthorisedUsers: User[] = [];
  actions: IAdminAction[];
  isLoading = true;

  constructor(
    public auth: AuthService,
    public toast: ToastComponent,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getAuthorisedUsers();
  }

  getAuthorisedUsers() {
    this.userService.getAuthorisedUsers().subscribe(
      data => {
        this.authorisedUsers = data;
        this.getUnauthorisedUsers();
      },
      error => console.log(error),
      () => (this.isLoading = false)
    );
  }

  authoriseUser(user) {
    this.userService.authoriseUser(user).subscribe(
      data => {
        this.getAuthorisedUsers();
      },
      error => console.log(error)
    );
  }

  getUnauthorisedUsers() {
    this.userService
      .getUnauthorisedUsers()
      .subscribe(
        data => (this.unauthorisedUsers = data),
        error => console.log(error),
        () => (this.isLoading = false)
      );
  }

  deleteUser(user: User) {
    if (
      window.confirm("Are you sure you want to delete " + user.username + "?")
    ) {
      this.userService
        .deleteUser(user)
        .subscribe(
          data =>
            this.toast.setMessage("user deleted successfully.", "success"),
          error => console.log(error),
          () => this.getAuthorisedUsers()
        );
    }
  }

  doCreateNewsPost() {
    this.router.navigate(["news"], {
      queryParams: { newsId: "new" }
    });
  }
}
