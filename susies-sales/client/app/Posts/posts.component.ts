import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { ToastComponent } from '../shared/toast/toast.component';
import { Post } from '../shared/models/post.model';
import { CurrencyPipe } from '@angular/common';
import { FileUploadService } from '../services/file-upload.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';
import { SelectionModel } from '@angular/cdk/collections';
import { ViewChild } from '@angular/core';
import {CalendarControlComponent} from '../shared/calendar-control/calendar-control.component';
import {NgxSmartModalService} from 'ngx-smart-modal';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
  providers: [CurrencyPipe, FileUploadService] // TODO FileUploadService should be globally available so it can be a singleton
})
export class PostsComponent implements OnInit {

  post = new Post();
  posts: Post[] = [];
  selectedPosts: Post[] = [];
  isLoading = true;
  isEditing = false;

  addPostForm: FormGroup;
  description = new FormControl('', Validators.required);
  from = new FormControl('', Validators.required);
  size = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  photo = new FormControl('', Validators.required);

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<Post>(this.allowMultiSelect, this.initialSelection);

  @ViewChild('bscalendar') bscalendarRef: CalendarControlComponent ;

  constructor(private postService: PostService,
              private fileUploadService: FileUploadService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              private router: Router,
              public auth: AuthService,
              private userService: UserService,
              public ngxSmartModalService: NgxSmartModalService) { }

  filesToUpload: FileList;
  user: User;
  dataSource:  Post[];

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
      () => this.onGetPostsComplete()
    );
  }

  onGetPostsComplete() {
    this.dataSource = this.posts;
    this.isLoading = false;
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

  goEditPost(row: any) {
    this.router.navigate(['rct-post/rct-post'], {queryParams : {postId: row.postId} });
  }

  goVeiwPost(row: any) {
    this.router.navigate(['rct-post/view-post'], {queryParams : {postId: row.postId, mode: "view"} });
  }

  goCreatePost(): void {
    this.router.navigate(['rct-post/rct-post'], {queryParams: {postId: 'new'}});
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

  // Material table logic

  columnsToDisplay = [ 'description', 'from', 'size', 'price', 'actions', 'select', 'dateTimePublish'];

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
    if (this.isAllSelected()) {
      // add all posts to selectedPosts
      this.selectedPosts = this.dataSource;
    } else if (!this.isAllSelected()) {
      this.selectedPosts = [];
    }
  }

// END Material table logic

  selectPostRow(row: any, isSelected: boolean) {
    console.log(isSelected);
    if (isSelected) {
      this.selectedPosts.push(row);
    } else if (!isSelected) {
      this.selectedPosts.splice(row);
    }
    // alert('selectPostRow: ' + row.postId);
    console.log(row);
    console.log(this.selectedPosts);
  }

  schedulePosts() {
    console.log(this.selectedPosts);
    this.ngxSmartModalService.getModal('myModal').open();
  }

}
