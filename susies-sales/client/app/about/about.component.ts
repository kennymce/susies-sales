import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../shared/models/user.model";
import { AuthService } from "../services/auth.service";
import { NewsService } from "../services/news.service";
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
    if (this.auth.currentUser._id != undefined){
      this.getNewsStories();
    } else
    {
      this.isLoading = false;
    }
  }

  newsStoryDeleted(event) {
    this.getNewsStories();
    console.log("newsStoryDeleted in parent component");
  }

  getNewsStories() {
    console.log(this.auth.currentUser);
      this.newsService
        .getNews()
        .subscribe(
          data => (this.newsStories = data),
          error => console.log(error),
          () => this.onGetNewsComplete()
        );
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
