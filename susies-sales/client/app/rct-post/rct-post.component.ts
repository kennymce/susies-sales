import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IPost } from '../Posts/post';
import { Post} from '../shared/models/post.model';
import { PostService} from '../services/post.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';
import { ToastComponent } from '../shared/toast/toast.component';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-rct-post',
  templateUrl: './rct-post.component.html',
  styleUrls: ['./rct-post.component.css'],
  providers: [FileUploadService]
})
export class RctPostComponent implements OnInit {

  postForm: FormGroup;
  post: Post = new Post();
  sub: Subscription;
  postId: string;
  pageTitle: string;
  errorMessage: string;
  filesToUpload: FileList;
  numberOfFiles: number;
  showPhotoPanel: boolean;
  isLoading: boolean = true;

  constructor(private fb: FormBuilder,
              private postService: PostService,
              private _route: ActivatedRoute,
              private router: Router,
              public toast: ToastComponent,
              private fileUploadService: FileUploadService) { }

  ngOnInit(): void {

    this.postForm = this.fb.group({
      postId: 'new',
      description: '',
      price: '',
      from: '',
      size: '',
      photos: ''
    });
    this.initPostIdFromRouteParam();
    if (this.postId != 'new') {
      this.getPost();
      this.pageTitle = "Edit Post";
    } else {
      this.pageTitle = "Create New Post";
      this.isLoading = false;
      //TODO router guards (mode is in queryString)
    }
  }

  initPostIdFromRouteParam(): void {
    // Get the postId from the query params
    this.sub = this._route
      .queryParams
      .subscribe(params => {
        this.postId = params['postId'];
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
    if (this.numberOfFiles > 0){
      this.showPhotoPanel = true;
      console.log('showphotopanel = true');
    }

    if (!this.post){
      this.pageTitle = 'Create New Post';
    } else {
      this.pageTitle = 'Edit Post';
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
  }

  save(mode) {
    if (this.postForm.dirty && this.postForm.valid) {
      // Copy the form values over the post object values
      let p = Object.assign({}, this.post, this.postForm.value);
      this.postService.savePost(p)
        .subscribe(
          () => this.onSaveComplete(mode),
          (error: any) => this.errorMessage = <any>error
        );
    }
    this.onSaveComplete(mode); // TODO is this needed?
  }

  onSaveComplete(mode): void {
    // Reset the form to clear the flags
    this.postForm.reset();
    if (this.postForm.dirty){
      this.toast.setMessage('Post added successfully.', 'success');
    }
    if (mode!='preview') {
      this.router.navigate(['posts']);
    } else {
      this.router.navigate(['rct-post/view-post'], {queryParams : {postId: this.post.postId, mode: 'preview'} });
    }
  }

  handleFileInput(files: FileList) {
    this.filesToUpload = files;
    try {
      this.uploadFilesToAPI();
      this.post.photos = Array.from(this.filesToUpload, x => x.name);
      this.numberOfFiles = this.post.photos.length;
      this.showPhotoPanel = this.numberOfFiles > 0;
    } catch(error) {
      this.handleError(error);
    }
    this.postForm.markAsDirty();
    // TODO deal with duplicate filenames: currently the upload fails silently
    // TODO make the toaster work for errors
  }
  uploadFilesToAPI() {
    this.fileUploadService.postFiles(this.filesToUpload).subscribe(data => {
      // upload success
      this.toast.setMessage('Files uploaded successfully.', 'success');
      this.postForm.patchValue({photos: this.post.photos})
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.router.navigate(['posts']);
  }

  openPhoto(photo: string) {
    window.open('http://localhost:3000/api/pictures/' + photo, '_blank');
  }

  preview(): void {
    this.save('preview');
  }

  handleError(error): void {
    this.toast.setMessage(`Dammit - error: ${error.toString()}`, 'error');
  }
}
