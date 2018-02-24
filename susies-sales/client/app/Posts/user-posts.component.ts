import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {PostService} from '../services/post.service';
import {ToastComponent} from '../shared/toast/toast.component';
import {Post} from '../shared/models/post.model';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';
import {User} from '../shared/models/user.model';
import {GimmieService} from '../services/gimmie.service';
import {IPost} from './post';
import {Observer} from 'rxjs/Observer';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.component.html',
  styleUrls: ['./user-posts.component.css']
})
export class UserPostsComponent implements OnInit {

  posts: Post[] = [];
  isLoading = true;

  addPostForm: FormGroup;
  description = new FormControl('', Validators.required);
  from = new FormControl('', Validators.required);
  size = new FormControl('', Validators.required);
  price = new FormControl('', Validators.required);
  photo = new FormControl('', Validators.required);

  constructor(private postService: PostService,
              private formBuilder: FormBuilder,
              public toast: ToastComponent,
              private router: Router,
              public auth: AuthService,
              private userService: UserService,
              private gimmieService: GimmieService) {
  }

  user: User;

  ngOnInit() {
    this.getUser();
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
      data =>
        this.user = data,
      error => console.log(error),
      () => {
        this.getGimmies();
        console.log('completed getUser. Got these gimmies: ', JSON.stringify(this.user.gimmies));
        this.isLoading = false;
      }
    );
  }

  getGimmies() {
    this.gimmieService.getGimmiesForUser(this.auth.currentUser.username).subscribe(
      data => {
        this.user.gimmies = data;
        console.log('Getting gimmies: they have :', JSON.stringify(this.user.gimmies));
      },
      error => console.log(error),
      () => {
        console.log('Got gimmies for ', this.user.username);
        this.getPosts();
        console.log('Finished getting gimmies for ', this.user.username);
        console.log('Number of posts retrieved: ', this.posts.length);
      }
    );
    this.isLoading = false;
  }

  getPosts() {
    this.user.gimmies.forEach(((post) => {
      console.log('Getting posts for Gimmies');
      this.postService.getPostJSON(post.postId)
        .subscribe(
          (post: IPost) => this.posts.push(post))
    }))
  }


  removePost(_id: string) {
    console.log('not yet implemented: removePost:', _id);
  }

  goVeiwPost(_id: string) {
    this.router.navigate(['rct-post/view-post'],
      {queryParams: {postId: _id, mode: "view"}});
  }
}
