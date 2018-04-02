import { Component, OnInit } from "@angular/core";
import { PostService } from "../services/post.service";
import { FormGroup, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { IPost } from "../Posts/post";
import { Post } from "../shared/models/post.model";
import { Gimmie } from "../shared/models/gimmie.model";
import { ToastComponent } from "../shared/toast/toast.component";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { User } from "../shared/models/user.model";
import { GimmieService } from "../services/gimmie.service";
import { PrivateMessageService } from "../services/private-message.service";
import { NgxSmartModalService } from "ngx-smart-modal";
import { IPrivateMessage } from "../privateMessage/privateMessage";
import { PrivateMessage } from "../shared/models/privateMessage.model";
import { AppSettings } from "../appSettings";

@Component({
  selector: "app-view-post",
  templateUrl: "./view-post.component.html",
  styleUrls: ["./view-post.component.css"]
})
export class ViewPostComponent implements OnInit {
  viewMode: string;
  postForm: FormGroup;
  post: Post = new Post();
  postId: string;
  sub: Subscription;
  isLoading: boolean = true;
  errorMessage: string;
  pageTitle: string;
  numberOfFiles: number;
  photoArray: Array<string>;
  user: User;
  gimmied: boolean;
  postsForUser: Post[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private gimmieService: GimmieService,
    private _route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    public toast: ToastComponent,
    private userService: UserService,
    private privateMessageService: PrivateMessageService,
    public ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      postId: "new",
      description: "",
      price: "",
      from: "",
      size: "",
      photos: ""
    });
    this.initRouteParams();
    this.getPost();
    this.getUser();
  }

  initRouteParams(): void {
    // Get the postId from the query params
    this.sub = this._route.queryParams.subscribe(params => {
      this.postId = params["postId"];
      this.viewMode = params["mode"];
    });
  }

  getPost(): void {
    // Get the data with the postId
    this.postService
      .getPostJSON(this.postId)
      .subscribe((post: IPost) => this.onPostRetrieved(post));
  }

  onPostRetrieved(post: IPost): void {
    console.log("onPostRetrieved...");
    if (this.postForm) {
      this.postForm.reset();
    }
    this.post = post;
    this.numberOfFiles = post.photos.length;

    if (this.viewMode == "preview") {
      this.pageTitle = "Preview Post";
    } else {
      this.pageTitle = "View Post";
    }

    // Update the data on the form
    this.postForm.patchValue({
      postId: this.postId,
      description: this.post.description,
      price: this.post.price,
      from: this.post.from,
      size: this.post.size,
      photos: this.post.photos
    });
    this.isLoading = false;
    this.photoArray = Array.from(this.post.photos);
  }

  getUser() {
    console.log("getUser...");
    this.userService
      .getUser(this.auth.currentUser)
      .subscribe(
        data => (this.user = data),
        error => console.log(error),
        () => this.onGetUserComplete()
      );
  }

  onGetUserComplete() {
    console.log("onGetUserComplete...");
    const promise = new Promise(resolve => {
      this.isLoading = false;
      console.log("user is: ", this.user);
      this.getPostsForUser();
      resolve();
    }).then(function() {
      console.log("in onGetUserComplete promise");
    });
    // This needs to be called once everything has completed
    this.gimmied = this.userHasGimmiedPost(this.post.postId);
  }

  goBack() {
    if (this.viewMode == "preview") {
      this.router.navigate(["rct-post/rct-post"], {
        queryParams: { postId: this.postId }
      });
    } else if (this.viewMode == "view") {
      this.router.navigate(["posts"]);
    } else if (this.viewMode == "view-mine") {
      this.router.navigate(["user-posts"]);
    }
  }

  claim() {
    if (!this.gimmied) {
      let g = new Gimmie("new", this.user.username, this.post.postId);
      let theGimmie = this.gimmieService
        .saveGimmie(g)
        .subscribe(
          () => this.onSaveGimmieComplete(g),
          (error: any) => (this.errorMessage = <any>error)
        );
    }
  }

  onSaveGimmieComplete(g: Gimmie) {
    this.gimmieService
      .getGimmiesForUser(this.auth.currentUser.username)
      .subscribe(
        data => {
          this.user.gimmies = data;
          console.log(
            "onSaveGimmieComplete getting gimmies: they have :",
            JSON.stringify(this.user.gimmies)
          );
          this.saveUser();
        },
        error => console.log(error),
        () => (this.isLoading = false)
      );
  }

  saveUser() {
    // save the user
    this.userService.editUser(this.user).subscribe(
      res => {
        this.toast.setMessage("Righto!", "success"); //TODO toaster doesn't work here
        this.gimmied = true;
      },
      error => console.log(error)
    );
  }

  userHasGimmiedPost(_Id): boolean {
    console.log(`looking for post_id: ${_Id} 
      within the ${this.postsForUser.length} posts of ${this.postsForUser}`);
    const post = this.postsForUser.filter(post => post._id === _Id);
    console.log("gimmie is@: ", post);
    console.log("userHasGimmiedPost: ", post.length > 0);
    return post.length > 0;
  }

  getPostsForUser() {
    console.log("in getPostsForUser...");
    this.gimmieService
      .getGimmiesForUser(this.auth.currentUser.username)
      .subscribe(
        data => {
          this.user.gimmies = data;
          console.log(
            "Getting gimmies: they have :",
            JSON.stringify(this.user.gimmies)
          );
        },
        error => console.log(error),
        () => {
          console.log("Got gimmies for ", this.user.username);
          this.getPosts();
        }
      );

    this.isLoading = false;
  }

  getPosts() {
    this.user.gimmies.forEach(post => {
      console.log("Getting posts for gimmie: ", post.postId);
      this.postService.getPostJSON(post.postId).subscribe((post: IPost) => {
        // TODO there's a more efficient way of doing this
        this.postsForUser.push(post);
        this.gimmied = this.userHasGimmiedPost(this.post.postId);
      });
    });
  }

  privateMessage() {
    this.ngxSmartModalService.getModal("myModal").open();
  }

  handlePrivateMessage() {
    let privateMessageText = (<HTMLInputElement>document.getElementById(
      "privateMessageText"
    )).value;
    if (privateMessageText.length > 0) {
      let _privateMessage = new PrivateMessage(
        "new",
        this.user.username,
        AppSettings.ADMIN_USER_NAME,
        this.post.postId,
        privateMessageText
      );
      console.log("Saving privateMessage: ", _privateMessage);
      this.savePrivateMessage(_privateMessage);
    }
    this.ngxSmartModalService.closeLatestModal();
    this.ngxSmartModalService.resetModalData("myModal");
  }

  savePrivateMessage(_privateMessage: IPrivateMessage) {
    // save the user
    this.privateMessageService.savePrivateMessage(_privateMessage).subscribe(
      res => {
        this.toast.setMessage("Righto!", "success"); //TODO toaster doesn't work here
      },
      error => console.log(error)
    );
  }

  setModalData(_id: string) {
    console.log("Setting modal data to: ", _id);
    this.ngxSmartModalService.getModal("myModal").open();
    this.ngxSmartModalService.setModalData(_id, "myModal");
  }

  debug() {
    console.log(
      `postsForUser: (${this.postsForUser.length}): ${this.postsForUser}`
    );
    this.postsForUser.forEach(obj => {
      console.log(obj.postId);
      console.log(this.userHasGimmiedPost(obj.postId));
      this.gimmied = this.userHasGimmiedPost(obj.postId);
    });
  }
}
