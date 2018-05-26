import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import { EmptyObservable } from "rxjs/observable/EmptyObservable";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/do";

import { News } from "../shared/models/news.model";
import { INews } from "../News/newsPost";

@Injectable()
export class NewsService {
  constructor(private http: HttpClient) {}

  theNews: INews;
  create: boolean;

  getNews(): Observable<News[]> {
    return this.http.get<News[]>("/api/news");
  }

  countNews(): Observable<number> {
    return this.http.get<number>("/api/news/count");
  }

  addNews(news: News): Observable<News> {
    return this.http.post<News>("/api/news", news);
  }

  getSingleNews(id: string): Observable<News> {
    return this.http.get<News>(`/api/news/${id}`);
  }

  saveNews(news: INews): Observable<INews> {
    if (news.newsId == "new") {
      console.log("in saveNews, the newsId = " + news.newsId);
      return this.createNews(news);
    } else {
      return this.updateNews(news);
    }
  }

  createNews(news: INews): Observable<INews> {
    return this.http
      .post("/api/news", news, {
        headers: { "Content-Type": "application/json" }
      })
      .map(this.extractData)
      .do(news => {
        console.log("creating News in service: " + JSON.stringify(news));
      })
      .catch(this.handleAngularJsonBug);
  }

  private updateNews(news: News) {
    console.log("in updateNews method in service");
    let url = `/api/news/${news.newsId}`;
    return this.http
      .put(url, news, { headers: { "Content-Type": "application/json" } })
      .map(() => news)
      .do(news =>
        console.log("updatingNews, in updateNews: " + JSON.stringify(news))
      )
      .catch(this.handleAngularJsonBug);
  }

  private extractData(response: Response) {
    console.log("response: ", response);
    let body = JSON.stringify(response);
    // TODO this ^ seems not to work - don't think it's really needed. Look at this in Post Service too
    return body || {};
  }

  static handleError(error: Response | any) {
    console.error("NewsService::handleError", error);
    return Observable.throw(error);
  }

  editNews(news: News): Observable<string> {
    return this.http.put(`/api/news/${news._id}`, news, {
      responseType: "text"
    });
  }

  deleteNews(news: News): Observable<string> {
    console.log(`deleting news in newsService: ${news.newsId}`);
    // TODO why on earth does this not work?
    return this.http.delete(`/api/news/${news._id}`, { responseType: 'text' });
  }

  private handleAngularJsonBug(error: HttpErrorResponse) {
    // TODO remove when this issue is fixed: https://github.com/angular/angular/issues/18396
    const JsonParseError = "Http failure during parsing for";
    const matches = error.message.match(new RegExp(JsonParseError, "ig"));

    if (error.status === 200 && matches.length === 1) {
      // return obs that completes;
      console.log(
        "returning empty observable from handleAgnularBug in News Service"
      );
      return new EmptyObservable();
    } else {
      console.log("re-throwing : ", error);
      return Observable.throw(error); // re-throw
    }
  }
}
