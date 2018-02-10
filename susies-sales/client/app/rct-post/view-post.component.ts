import {Component, OnInit} from '@angular/core';
import {PostService} from '../services/post.service';
import {FormGroup, FormBuilder} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {IPost} from '../Posts/post';
import {Post} from '../shared/models/post.model';
import { IGimmie} from '../gimmie/gimmie';
import { Gimmie} from '../shared/models/gimmie.model';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {

  viewMode: string;
  postForm: FormGroup;
  post: Post = new Post();
  postId: string;
  sub: Subscription;
  isLoading: boolean = true;
  pageTitle: string;
  numberOfFiles: number;
  photoArray: Array<string>;
  user: User;

  constructor(private fb: FormBuilder,
              private postService: PostService,
              private _route: ActivatedRoute,
              private router: Router,
              private auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService) {
  }

  ngOnInit() {
    this.postForm = this.fb.group({
      postId: 'new',
      description: '',
      price: '',
      from: '',
      size: '',
      photos: ''
    });
    this.initRouteParams();
    this.getPost();
    this.getUser();
  }

  initRouteParams(): void {
    // Get the postId from the query params
    this.sub = this._route
      .queryParams
      .subscribe(params => {
        this.postId = params['postId'];
        this.viewMode = params['mode'];
      });
  }

  getPost(): void {
    // Get the data with the postId
    this.postService.getPostJSON(this.postId)
      .subscribe(
        (post: IPost) => this.onPostRetrieved(post))
  }

  onPostRetrieved(post: IPost): void {
    if (this.postForm) {
      this.postForm.reset();
    }
    this.post = post;
    this.numberOfFiles = post.photos.length;

    if (this.viewMode == 'preview') {
      this.pageTitle = 'Preview Post';
    } else {
      this.pageTitle = 'View Post';
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
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => this.user = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  goBack() {
    this.router.navigate(['rct-post/rct-post'], {queryParams: {postId: this.postId}});
  }
  claim() {

    alert(this.user.username);
  }
  debug() {
    this.photoArray =Array.from(this.post.photos);
    alert(this.photoArray.length);
  }
}
