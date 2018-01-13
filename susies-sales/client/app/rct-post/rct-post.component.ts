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
  photoHTML: string;
  numberOfFiles: number;

  constructor(private fb: FormBuilder,
              private postService: PostService,
              private _route: ActivatedRoute,
              private router: Router,
              public toast: ToastComponent,
              private fileUploadService: FileUploadService) { }

  ngOnInit(): void {

    this.postForm = this.fb.group({
      postId: '',
      description: '',
      price: '',
      from: '',
      size: '',
      photos: ''
    });
    this.initPostIdFromRouteParam();
    this.getPost();
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
    this.photoHTML = (this.renderPhotos(this.post.photos));
  }

  save() {
    if (this.postForm.dirty && this.postForm.valid) {
      // Copy the form values over the post object values
      let p = Object.assign({}, this.post, this.postForm.value);
      this.postService.savePost(p)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.errorMessage = <any>error
        );
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.postForm.reset();
    this.toast.setMessage('Post added successfully.', 'success');
    this.router.navigate(['../posts/posts']);
  }

  handleFileInput(files: FileList) {
    this.filesToUpload = files;
    try {
      this.uploadFilesToAPI();
      this.post.photos = Array.from(this.filesToUpload, x => x.name);
    } catch(error) {
      this.handleError(error);
    }
    // TODO tie the uploaded files to the correct record
    // TODO deal with duplicate filenames: currently the upload fails silently
    // TODO list the associated files in the form, including when the post loads in edit mode
    // TODO make the toaster work for errors
  }
  uploadFilesToAPI() {
    this.fileUploadService.postFiles(this.filesToUpload).subscribe(data => {
      // do something, if upload success
      this.toast.setMessage('Files uploaded successfully.', 'success');
      this.photoHTML = (this.renderPhotos(this.post.photos));
      this.postForm.patchValue({photos: this.post.photos})
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    // TODO implement cancel()
  }
  renderPhotos(inputArray: string[]): string {
    // add the opening and closing UL tags and sandwich the items inbetween
    let outputString: string = '<UL>';
    for (let photo of inputArray) {
      outputString +=(this.renderListItem(photo));
    }
    outputString.concat('</UL>');
    return outputString;
  }

  renderListItem(photo): string {
    return (`<li>${photo}</li>`);
  }

  handleError(error): void {
    this.toast.setMessage(`Dammit - error: ${error.toString()}`, 'error');
  }
}
