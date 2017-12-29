import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Post } from '../shared/models/post.model';

@Injectable()
export class PostService {

  constructor(private http: HttpClient) { }

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

  editPost(post: Post): Observable<string> {
    return this.http.put(`/api/post/${post._id}`, post, { responseType: 'text' });
  }

  deletePost(post: Post): Observable<string> {
    return this.http.delete(`/api/post/${post._id}`, { responseType: 'text' });
  }

}
