import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../shared/models/post.model';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  postUpdated = false;
  @Output() postWasUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {
    alert('in c-tor in post child component');
    //alert('this._postResult.description in child component ctor: ' + this.post.description);
  }

  applyEdit() {
    this.postWasUpdated.emit(true);
    alert('typeof post:' + typeof this.post);
    this.router.navigate(['posts']);
  }

  applyCancel() {
    this.router.navigate(['posts']);
  }
  ngOnInit() {
    //alert(`in child component - description is ${this.post.description}`);
    alert('ngOnInit in child component'); // this is not executed
  }
}
