import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import { Router } from "@angular/router";
import { PostService } from "../services/post.service";
import { ToastComponent } from "../shared/toast/toast.component";
import { Post } from "../shared/models/post.model";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { User } from "../shared/models/user.model";
import { GimmieService } from "../services/gimmie.service";
import { IPost } from "./post";
import { NgxSmartModalService } from "ngx-smart-modal";

@Component({
  selector: "app-user-posts",
  templateUrl: "./user-posts.component.html",
  styleUrls: ["./user-posts.component.css"]
})
export class UserPostsComponent implements OnInit {
  posts: Post[] = [];
  isLoading = true;

  addPostForm: FormGroup;
  description = new FormControl("", Validators.required);
  from = new FormControl("", Validators.required);
  size = new FormControl("", Validators.required);
  price = new FormControl("", Validators.required);
  photo = new FormControl("", Validators.required);

  constructor(
    private postService: PostService,
    private formBuilder: FormBuilder,
    public toast: ToastComponent,
    private router: Router,
    public auth: AuthService,
    private userService: UserService,
    private gimmieService: GimmieService,
    public ngxSmartModalService: NgxSmartModalService
  ) {}

  user: User;

  ngOnInit() {
    this.getUser();
    this.addPostForm = this.formBuilder.group({
      description: this.description,
      from: this.from,
      size: this.size,
      price: this.price,
      photo: this.photo
    });
  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => (this.user = data),
      error => console.log(error),
      () => {
        this.getGimmies();
        console.log(
          "completed getUser. Got these gimmies: ",
          JSON.stringify(this.user.gimmies)
        );
        this.isLoading = false;
      }
    );
  }

  getGimmies() {
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
          console.log("Finished getting gimmies for ", this.user.username);
        }
      );
    this.isLoading = false;
  }

  getPosts() {
    for (let i = 0; i < this.user.gimmies.length; i++ ) {
      this.posts.push(this.user.gimmies[i].Post);
    }
  }

  setModalData(_id: string) {
    console.log("Setting modal data to: ", _id);
    this.ngxSmartModalService.getModal("myModal").open();
    this.ngxSmartModalService.setModalData(_id, "myModal");
  }

  confirmRemove() {
    let _postId = this.ngxSmartModalService.getModalData("myModal");
    console.log("Removing post_id: ", _postId);
    this.removePost(_postId);
    this.ngxSmartModalService.closeLatestModal();
    this.ngxSmartModalService.resetModalData("myModal");
  }

  removePost(postId: string) {
    console.log(`removePost: ${JSON.stringify(this.posts)}`);
    const pos = this.posts.map(elem => elem._id).indexOf(postId);
    this.posts.splice(pos, 1);
    const gimmie = this.user.gimmies.find(gimmie => gimmie.Post.postId === postId);
    this.doRemovePost(postId, gimmie._id);
  }

  deleteGimmie(postId: string, gimmieId: string) {
    this.gimmieService
      .deleteGimmie(gimmieId)
      .subscribe(
        data => this.saveUser(),
        error => console.log(error),
        () =>
          console.log(
            `Gimmie deleted for postId ${postId} gimmieId ${gimmieId}`
          )
      );
    const pos = this.user.gimmies.map(elem => elem._id).indexOf(postId);
    this.user.gimmies.splice(pos, 1);
  }

  doRemovePost(postId: string, gimmieId: string) {
    this.deleteGimmie(postId, gimmieId);
  }

  saveUser() {
    // save the user
    this.userService.editUser(this.user).subscribe(
      res => {
        console.log("user saved:", this.user);
      },
      error => console.log(error)
    );
  }

  goVeiwPost(_id: string) {
    this.router.navigate(["rct-post/view-post"], {
      queryParams: { postId: _id, mode: "view-mine" }
    });
  }
}
