import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../shared/models/user.model";
import { AuthService } from "../services/auth.service";
import { NewsService } from "../services/news.service";
import { Subscription } from "rxjs/Subscription";
import { AppSettings } from "../appSettings";
import { News } from "../shared/models/news.model";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"]
})
export class AboutComponent implements OnInit {
  newsStories: News[];
  isLoading: boolean = true;
  user: User;

  constructor(
    private newsService: NewsService,
    private auth: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getNewsStories();
  }

  newsStoryDeleted(event) {
    this.getNewsStories();
    console.log("newsStoryDeleted in parent component");
  }

  getNewsStories() {
    if (!this.auth.currentUser == undefined) {
      this.newsService
        .getNews()
        .subscribe(
          data => (this.newsStories = data),
          error => console.log(error),
          () => this.onGetNewsComplete()
        );
    } else
    {
      this.isLoading = false;
    }
  }

  onGetNewsComplete() {
    console.log(`loaded ${this.newsStories.length} news stories`);
    this.getUser();
    this.isLoading = false;
  }

  getUser() {
    this.userService
      .getUser(this.auth.currentUser)
      .subscribe(
        data => (this.user = data),
        error => console.log(error),
        () => this.onGetUserComplete()
      );
  }

  onGetUserComplete() {
    this.isLoading = false;
    console.log("user details fetched");
  }
}
