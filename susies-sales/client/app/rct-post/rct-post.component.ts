import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IPost } from '../Posts/post';
import {Post} from '../shared/models/post.model';
import {PostService} from '../services/post.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute} from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rct-post',
  templateUrl: './rct-post.component.html',
  styleUrls: ['./rct-post.component.css']
})
export class RctPostComponent implements OnInit {
  postForm: FormGroup;
  post: Post = new Post();
  sub: Subscription;
  postId: string;
  pageTitle: string;
  errorMessage: string;

  constructor(private fb: FormBuilder,
              private postService: PostService,
              private _route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {

    this.postForm = this.fb.group({
      postId: '',
      description: '',
      price: '',
      from: '',
      size: ''
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
      size: this.post.size
    })
  }

  save() {
    if (this.postForm.dirty && this.postForm.valid) {
      console.log('in save() method: postId = ' + this.post.postId);
      // Copy the form values over the post object values
      let p = Object.assign({}, this.post, this.postForm.value);
      this.postService.savePost(p)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.errorMessage = <any>error
        );
    }
    console.log(this.postForm);
    console.log('Saved: ' + JSON.stringify(this.postForm.value));
  }

  onSaveComplete(): void {
    console.log('in onSaveComplete() method');
    // Reset the form to clear the flags
    this.postForm.reset();
    this.router.navigate(['../posts/posts']);
  }
}
