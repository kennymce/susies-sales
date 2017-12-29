import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { ToastComponent } from '../shared/toast/toast.component';
import {Post} from '../shared/models/post.model';
import { ActivatedRoute} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

  postId: string;
  sub: Subscription;

  constructor(public toast: ToastComponent,
              private data: PostService,
              private _route: ActivatedRoute) {
  }

  ngOnInit() {
    // this.data.getPost(this.postId);
    this.sub = this._route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.postId = params['postId'];
        this.data.getPost(this.postId);
      });
  }
}
