import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class FileUploadService {

  constructor( private http: HttpClient) {  }

  postFile(fileToUpload: File): Observable<boolean> {
    const endpoint = 'http://localhost:3000/api/pictures';
    const formData: FormData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    return this.http
      .post(endpoint, formData, { headers: {'file': fileToUpload.name }})
      .map(() =>  true );
  }
}
