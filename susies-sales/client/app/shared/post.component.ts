import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() postId: string;
  postUpdated = false;
  @Output() postWasUpdated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  applyEdit() {
    this.postWasUpdated.emit(true);
    this.router.navigate(['posts']);
  }

  applyCancel() {
    this.router.navigate(['posts']);
  }
  ngOnInit() {
  }
}
