import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AppSettings } from "../appSettings";

@Injectable()
export class FileUploadService {
  constructor(private http: HttpClient) {}

  postFiles(filesToUpload: FileList): Observable<boolean> {
    const endpoint = AppSettings.API_ENDPOINT + "pictures";
    const formData: FormData = new FormData();
    for (let i = 0; i < filesToUpload.length; i++) {
      formData.append("file", filesToUpload[i], filesToUpload[i]["name"]);
    }
    return this.http.post(endpoint, formData).map(() => true);
  }
}
