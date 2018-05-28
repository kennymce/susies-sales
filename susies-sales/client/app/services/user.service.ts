import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { User } from '../shared/models/user.model';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  register(user: User): Observable<User> {
    return this.http.post<User>('/api/user', user);
  }

  login(credentials): Observable<any> {
    return this.http.post<any>('/api/login', credentials);
  }

  getAuthorisedUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  getUnauthorisedUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users/new')
  }

  authoriseUser(user: User): Observable<string> {
    return this.http.put(`/api/user/thisgirlsok/${user._id}`, user, { responseType: 'text' });
  }

  countUsers(): Observable<number> {
    return this.http.get<number>('/api/users/count');
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>('/api/user', user);
  }

  getUser(user: User): Observable<User> {
    return this.http.get<User>(`/api/user/${user._id}`);
  }

  editUser(user: User): Observable<string> {
    return this.http.put(`/api/user/${user._id}`, user, { responseType: 'text' });
  }

  deleteUser(user: User): Observable<string> {
    return this.http.delete(`/api/user/${user._id}`, { responseType: 'text' });
  }

  authGetUser(id: string, token): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`,
      {headers: new HttpHeaders().set('x-access-token', token)});
  }
}
