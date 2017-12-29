import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {Post} from '../shared/models/post.model';
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

  constructor(public toast: ToastComponent,
              private _data: PostService,
              private _route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.data.getPost(this.postId);
    this.sub = this._route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.postId = params['postId'];
        // https://hackernoon.com/understanding-creating-and-subscribing-to-observables-in-angular-426dbf0b04a3
        this.postToBeEdited$ = this._data.getPost(this.postId);
      });
  }
}
