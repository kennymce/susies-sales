import { Injectable } from '@angular/core';
import { IPrivateMessage } from '../privateMessage/privateMessage';
import { PrivateMessage } from '../shared/models/privateMessage.model';

import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';

@Injectable()
export class PrivateMessageService {

  constructor(private http: HttpClient) { }

  thePrivateMessage: IPrivateMessage;
  create: boolean;

  getPrivateMessages(): Observable<PrivateMessage[]> {
    return this.http.get<PrivateMessage[]>('/api/pm');
  }

  countPrivateMessages(): Observable<number> {
    return this.http.get<number>('/api/pm/count');
  }

  addPrivateMessage(privateMessage: PrivateMessage): Observable<PrivateMessage> {
    return this.http.post<PrivateMessage>('/api/pm', privateMessage);
  }

  getPrivateMessage(id: string): Observable<PrivateMessage> {
    return this.http.get<PrivateMessage>(`/api/pm/${id}`);
  }

  getPrivateMessagesForUser(id: string): Observable<IPrivateMessage[]> {
    let url = `/api/pm/${id}`;
    return this.http
      .get(url)
      .map(response => {
        this.thePrivateMessage = <IPrivateMessage>response;
        return <IPrivateMessage>response;
      })
      .do(privateMessage=> console.log('getting privateMessage from service: '+ JSON.stringify(this.thePrivateMessage)))
      .catch(PrivateMessageService.handleError);
  }

  savePrivateMessage(privateMessage: IPrivateMessage): Observable<IPrivateMessage> {
    if (privateMessage.privateMessageId == 'new') {
      console.log('in savePrivateMessage, the privateMessageId = ' + privateMessage.privateMessageId);
      return this.createPrivateMessage(privateMessage)
    } else {
      return this.updatePrivateMessage(privateMessage);
    }
  }

  createPrivateMessage(privateMessage: IPrivateMessage): Observable<IPrivateMessage> {
    return this.http.post('/api/pm', privateMessage, {headers: {'Content-Type': 'application/json'}})
      .map(this.extractData)
      .do(privateMessage => {
        console.log('creating PrivateMessage in service: ' + JSON.stringify((privateMessage)));
      })
      .catch(this.handleAngularJsonBug);
  }

  private updatePrivateMessage(privateMessage: PrivateMessage) {
    console.log('in updatePrivateMessage method in service');
    let url = `/api/pm/${privateMessage.privateMessageId}`;
    return this.http.put(url, privateMessage, {headers: {'Content-Type':'application/json'}})
      .map(() => privateMessage)
      .do(privateMessage => console.log('updatingPrivateMessage, in updatePrivateMessage: ' + JSON.stringify(privateMessage)))
      .catch(this.handleAngularJsonBug);
  }

  private extractData(response: Response) {
    console.log('response: ',response);
    let body = JSON.stringify(response);
    // TODO this ^ seems not to work - don't think it's really needed. Look at this in Post Service too
    return body || {};
  }

  static handleError (error: Response | any) {
    console.error('PrivateMessageService::handleError', error);
    return Observable.throw(error);
  }

  editPrivateMessage(privateMessage: PrivateMessage): Observable<string> {
    return this.http.put(`/api/pm/${privateMessage._id}`, privateMessage, { responseType: 'text' });
  }

  deletePrivateMessage(_id: string): Observable<string> {
    console.log(`deleting privateMessage in privateMessageService: ${_id}`);
    return this.http.delete(`/api/pm/${_id}`, { responseType: 'text' });
  }

  private handleAngularJsonBug (error: HttpErrorResponse) {
    // TODO remove when this issue is fixed: https://github.com/angular/angular/issues/18396
    const JsonParseError = 'Http failure during parsing for';
    const matches = error.message.match(new RegExp(JsonParseError, 'ig'));

    if (error.status === 200 && matches.length === 1) {
      // return obs that completes;
      console.log('returning empty observable from handleAgnularBug in PrivateMessage Service');
      return new EmptyObservable();
    } else {
      console.log('re-throwing : ', error);
      return Observable.throw(error);		// re-throw
    }
  }

}
