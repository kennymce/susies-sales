import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Post } from '../shared/models/post.model';
import { CurrencyPipe } from '@angular/common';
import { FileUploadService } from '../services/file-upload.service';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {User} from '../shared/models/user.model';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [CurrencyPipe, FileUploadService] // TODO FileUploadService should be globally available so it can be a singleton
})
export class PostsComponent implements OnInit {

  post = new Post();
  posts: Post[] = [];
  isLoading = true;
  isEditing = false;

  addPostForm: FormGroup;
  description = new FormControl('', Validators.required);
  from = new FormControl('', Validators.required);
  size = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  photo = new FormControl('', Validators.required);

  constructor(private postService: PostService,
              private fileUploadService: FileUploadService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              private router: Router,
              public auth: AuthService,
              private userService: UserService) { }

  filesToUpload: FileList;
  user: User;

  handleFileInput(files: FileList) {
     this.filesToUpload = files;
    this.uploadFilesToAPI();
  }
  uploadFilesToAPI() {
    this.fileUploadService.postFiles(this.filesToUpload).subscribe(data => {
      // do something, if upload success
    }, error => {
      console.log(error);
    });
  }
//  transformCurrency(number) {
//    this.currencyPipe.transform(number, 'GBP');
//  }
// TODO Currency Pipe https://stackoverflow.com/questions/42254077/angular-2-date-pipe-inside-a-formcontrol-input

  ngOnInit() {
    this.getUser();
    this.getPosts();
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
      data => this.user = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  getPosts() {
    this.postService.getPosts().subscribe(
      data => this.posts = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  addPost() {
    this.postService.addPosts(this.addPostForm.value).subscribe(
      res => {
        this.posts.push(res);
        this.addPostForm.reset();
        this.toast.setMessage('post added successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  enableEditing(post: Post) {
    this.isEditing = true;
    this.post = post;
  }

  goEditPost(_id: string) {
    this.router.navigate(['rct-post/rct-post'], {queryParams : {postId: _id} });
  }

  goVeiwPost(_id: string) {
    this.router.navigate(['rct-post/view-post'], {queryParams : {postId: _id, mode: "view"} });
  }

  goCreatePost(): void {
    this.router.navigate(['rct-post/rct-post'], {queryParams: {postId: 'new'}});
  }

  cancelEditing() {
    this.isEditing = false;
    this.post = new Post();
    this.toast.setMessage('item editing cancelled.', 'warning');
    // reload the Posts to reset the editing
    this.getPosts();
  }

  editPost(post: Post) {
    this.postService.editPost(post).subscribe(
      () => {
        this.isEditing = false;
        this.post = post;
        this.toast.setMessage('item edited successfully.', 'success');
      },
      error => console.log(error)
    );
  }

  deletePost(post: Post) {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      this.postService.deletePost(post).subscribe(
        () => {
          const pos = this.posts.map(elem => elem._id).indexOf(post._id);
          this.posts.splice(pos, 1);
          this.toast.setMessage('item deleted successfully.', 'success');
        },
        error => console.log(error)
      );
    }
  }

}
