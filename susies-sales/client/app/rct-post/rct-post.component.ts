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
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';


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
  showPhotoPanel: boolean;

  constructor(private fb: FormBuilder,
              private postService: PostService,
              private _route: ActivatedRoute,
              private router: Router,
              public toast: ToastComponent,
              private fileUploadService: FileUploadService,
              private sanitizer: DomSanitizer) { }

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
    } else if (!this.postForm.dirty){
      this.onSaveComplete(); //TODO tidy this up
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.postForm.reset();
    if (this.postForm.dirty){
      this.toast.setMessage('Post added successfully.', 'success');
    }
    this.router.navigate(['posts']);
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
      // do something, if upload success
      this.toast.setMessage('Files uploaded successfully.', 'success');
      this.photoHTML = (this.renderPhotos(this.post.photos));
      this.postForm.patchValue({photos: this.post.photos})
    }, error => {
      console.log(error);
    });
  }

  cancel() {
    this.router.navigate(['posts']);
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
    // TODO this should come from config
    const picturesURL = 'http://localhost:3000/api/pictures/';
    let link: string = picturesURL + photo;
    link = encodeURI(link);
    let listItem: string = `<li><a href="${link}">${photo}</a></li>`; //TODO this should open in a new tab: window.open('url', '_blank');
    return(listItem); // or if we can't do that due to the domSanitizer then warn user about unsaved changes
    //let listItem: string = `<li><a href="" onclick="window.open(${link}","_blank")</a></li>`;
    //return (this.sanitizer.bypassSecurityTrustScript(listItem)).toString();
  }

  handleError(error): void {
    this.toast.setMessage(`Dammit - error: ${error.toString()}`, 'error');
  }
}
