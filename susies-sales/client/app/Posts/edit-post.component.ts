import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {Post} from '../shared/models/post.model';
import { IPost } from '../Posts/post';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  postId: string;
  sub: Subscription;
  postToBeEdited$: Observable<Post>;
  _postResult: IPost;
  _description: string;

  constructor(public toast: ToastComponent,
              private _data: PostService,
              private _route: ActivatedRoute) {

  }
  ngAfterViewChecked() {
    //this.getPost();
    //alert("ngAfterViewChecked");
  }

  ngOnInit() {
    // this.data.getPost(this.postId);
/*    this.sub = this._route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.postId = params['postId'];
        // https://hackernoon.com/understanding-creating-and-subscribing-to-observables-in-angular-426dbf0b04a3
        this.postToBeEdited$ = this._data.getPost(this.postId);
      });*/
    //this.getPost();
    //alert(`ngOnInit in edit-post component`);
    this.getPost_Alt();
  }

  // this is really good: https://medium.com/codingthesmartway-com-blog/angular-4-3-httpclient-accessing-rest-web-services-with-angular-2305b8fd654b
  // this too! https://www.sitepoint.com/angular-rxjs-create-api-service-rest-backend/

  getPost(): void {
    // Get the postId from the query params
    this.sub = this._route
      .queryParams
      .subscribe(params => {
        this.postId = params['postId'];
      });
    // Get the data with the postId
    this._data.getPostJSON(this.postId)
      .subscribe(value => {this._description = value.description;
      this._postResult = value});
    // alert('post result description from edit-post: ' + this._postResult.description);
    alert('single description: ' + this._description);
  }

  getPost_Alt(): void {
    // Get the postId from the query params
    this.sub = this._route
      .queryParams
      .subscribe(params => {
        this.postId = params['postId'];
      });
    // Get the data with the postId
    this._data.getPostJSON(this.postId)
      .subscribe(
        (post: IPost) => this.onPostRetrieved(post))
  }

  onPostRetrieved(post: IPost): void {
    this._postResult = post;
    alert('onPostRetrieved has post.description = ' + post.description);
  }

  ngOnChanges() {
    //alert(`ngOnChanges`);
  }


  ngDoCheck() {
    //alert("ngDoCheck")
  }

  ngAfterContentInit() {
    //alert("ngAfterContentInit");
  }

  ngAfterContentChecked() {
    //alert("ngAfterContentChecked");
  }

  ngAfterViewInit() {
    //alert("ngAfterViewInit");
  }



  ngOnDestroy() {
    //alert("ngOnDestroy");
  }
}
