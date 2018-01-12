import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';

import { Post } from '../shared/models/post.model';
import { IPost } from '../Posts/post';


@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

  thePost: IPost;

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('/api/Posts');
  }

  countPosts(): Observable<number> {
    return this.http.get<number>('/api/Posts/count');
  }

  addPosts(post: Post): Observable<Post> {
    return this.http.post<Post>('/api/post', post);
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`/api/post/${id}`);
  }

  getPostJSON(id: string): Observable<IPost> {
    let url = `/api/post/${id}`;
    return this.http
      .get(url)
      .map(response => {
        this.thePost = <IPost>response;
        return <IPost>response;
      })
      .do(post => console.log('getting product from service: '+ JSON.stringify(this.thePost)))
      .catch(PostService.handleError);
  }

  savePost(post: IPost): Observable<IPost> {
    // TODO logic to save a new post goes in here but updating only for now
    return this.updatePost(post);
  }

  private updatePost(post: Post) {
    console.log('in updatePost method in service');
    let url = `/api/post/${post.postId}`;
    return this.http.put(url, post, {headers: {'Content-Type':'application/json'}})
      .map(() => post)
      .do(post => console.log('updatingPost, in updatePost: ' + JSON.stringify(post)))
      .catch(PostService.handleError);
  }

  static handleError (error: Response | any) {
    console.error('PostService::handleError', error);
    return Observable.throw(error);
  }

  editPost(post: Post): Observable<string> {
    return this.http.put(`/api/post/${post._id}`, post, { responseType: 'text' });
  }

  deletePost(post: Post): Observable<string> {
    return this.http.delete(`/api/post/${post._id}`, { responseType: 'text' });
  }
}
