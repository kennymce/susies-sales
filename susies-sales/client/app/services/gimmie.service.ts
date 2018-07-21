import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';

import { Gimmie } from '../shared/models/gimmie.model';
import { IGimmie } from '../gimmie/gimmie';


@Injectable()
export class GimmieService{

  constructor(private http: HttpClient) { }

  theGimmie: IGimmie;
  create: boolean;

  getGimmies(): Observable<Gimmie[]> {
    return this.http.get<Gimmie[]>('/api/gimmie');
  }

  countGimmies(): Observable<number> {
    return this.http.get<number>('/api/gimie/count');
  }

  addGimmie(gimmie: Gimmie): Observable<Gimmie> {
    return this.http.post<Gimmie>('/api/gimmie', gimmie);
  }

  getGimmie(id: string): Observable<Gimmie> {
    return this.http.get<Gimmie>(`/api/gimmie/${id}`);
  }

  getGimmiesForUser(id: string): Observable<IGimmie[]> {
    let url = `/api/gimmie/${id}`;
    return this.http
      .get(url)
      .map(response => {
        this.theGimmie = <IGimmie>response;
        return <IGimmie>response;
      })
      .do(gimmie=> console.log('getting gimmie from service: '+ JSON.stringify(this.theGimmie)))
      .catch(GimmieService.handleError);
  }

  saveGimmie(gimmie: IGimmie): Observable<IGimmie> {
    if (gimmie.gimmieId == 'new') {
      console.log('in saveGimmie, the gimmieId = ' + gimmie.gimmieId);
      return this.createGimmie(gimmie)
    } else {
      return this.updateGimmie(gimmie);
    }
  }

  createGimmie(gimmie: IGimmie): Observable<IGimmie> {
    return this.http.post('/api/gimmie', gimmie, {headers: {'Content-Type': 'application/json'}})
      .map(this.extractData)
      .do(gimmie => {
        console.log('creating Gimmie in service: ' + JSON.stringify((gimmie)));
      })
      .catch(this.handleAngularJsonBug);
  }

  private updateGimmie(gimmie: Gimmie) {
    let url = `/api/gimmie/${gimmie.gimmieId}`;
    return this.http.put(url, gimmie, {headers: {'Content-Type':'application/json'}})
      .map(() => gimmie)
      .do(gimmie => console.log('updatingGimmie, in updateGimmie: ' + JSON.stringify(gimmie)))
      .catch(this.handleAngularJsonBug);
  }

  private extractData(response: Response) {
    console.log('response: ',response);
     let body = JSON.stringify(response);
    // TODO this ^ seems not to work - don't think it's really needed. Look at this in Post Service too
    return body || {};
  }

  static handleError (error: Response | any) {
    console.error('GimmieService::handleError', error);
    return Observable.throw(error);
  }

  editGimmie(gimmie: Gimmie): Observable<string> {
    return this.http.put(`/api/gimmie/${gimmie._id}`, gimmie, { responseType: 'text' });
  }

  deleteGimmie(_id: string): Observable<string> {
    console.log(`deleting gimmie in gimmieService: ${_id}`);
    return this.http.delete(`/api/gimmie/${_id}`, { responseType: 'text' });
  }

  private handleAngularJsonBug (error: HttpErrorResponse) {
    // TODO remove when this issue is fixed: https://github.com/angular/angular/issues/18396
    const JsonParseError = 'Http failure during parsing for';
    const matches = error.message.match(new RegExp(JsonParseError, 'ig'));

    if (error.status === 200 && matches.length === 1) {
      // return obs that completes;
      console.log('returning empty observable from handleAgnularBug in Gimmie Service')
      return new EmptyObservable();
    } else {
      console.log('re-throwing : ', error);
      return Observable.throw(error);		// re-throw
    }
  }
}
