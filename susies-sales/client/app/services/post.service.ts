import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/Concatmap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/take';

import { Post } from '../shared/models/post.model';
import { IPost } from '../Posts/post';



@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

  thePost: IPost;
  create: boolean;

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
    // TODO logic to save a new post also goes in here
    console.log('in savePost, the postId = ' + post.postId);
    if (post.postId == 'new') {
      return this.createPost(post)
    } else {
      return this.updatePost(post);
    }
  }

  schedulePosts(postIds: string[], dateTime: Date) {
    // TODO the scheduleDateTime could be put in the req body
    console.log(`In post service, dateTime is: ${dateTime}`);
    return this.http.post('/api/Posts/schedule',postIds,
      {params: new HttpParams().set('scheduleDateTime', dateTime.toUTCString()),
      headers: new HttpHeaders().set('Content-Type', 'application/json')});
  }

  createPost(post: IPost): Observable<IPost> {
    return this.http.post('/api/post', post, {headers: {'Content-Type': 'application/json'}})
      .map(this.extractData)
      .do(post => console.log('creating Post in service: ' + JSON.stringify((post))))
      .catch(this.handleAngularJsonBug);
  }

  private updatePost(post: Post) {
    console.log('in updatePost method in service');
    console.log('post.photos is...' + post.photos);
    let url = `/api/post/${post.postId}`;
    return this.http.put(url, post, {headers: {'Content-Type':'application/json'}})
      .map(() => post)
      .do(post => console.log('updatingPost, in updatePost: ' + JSON.stringify(post)))
      .catch(this.handleAngularJsonBug);
  }

  private extractData(response: Response) {
    let body = response.json();
    return body || {};
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

  private handleAngularJsonBug (error: HttpErrorResponse) {
    // TODO remove when this issue is fixed: https://github.com/angular/angular/issues/18396
    const JsonParseError = 'Http failure during parsing for';
    const matches = error.message.match(new RegExp(JsonParseError, 'ig'));

    if (error.status === 200 && matches.length === 1) {
      // return obs that completes;
      return new EmptyObservable();
    } else {
      console.log('re-throwing ');
      return Observable.throw(error);		// re-throw
    }
  }
}
