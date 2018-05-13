import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { News } from "../shared/models/news.model";
import { Subscription } from "rxjs/Subscription";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ToastComponent } from "../shared/toast/toast.component";
import { FileUploadService } from "../services/file-upload.service";
import { AppSettings } from "../appSettings";
import { NewsService } from "../services/news.service";
import { INews } from "./newsPost";
import { CalendarControlComponent } from "../shared/calendar-control/calendar-control.component";
import { ViewChild } from "@angular/core";
import { NgxSmartModalService } from "ngx-smart-modal";
import { DateUtility } from "../shared/utility/date";
import { HtmlUtility } from "../shared/utility/html";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.css"],
  providers: [FileUploadService]
})
export class NewsComponent implements OnInit {
  newsForm: FormGroup;
  news: News = new News();
  sub: Subscription;
  newsId: string;
  pageTitle: string;
  errorMessage: string;
  filesToUpload: FileList;
  numberOfFiles: number;
  showPhotoPanel: boolean;
  isLoading: boolean = true;
  scheduleDateTime = new Date();

  @ViewChild("bscalendar") bscalendarRef: CalendarControlComponent;

  constructor(
    private fb: FormBuilder,
    private newsService: NewsService,
    private _route: ActivatedRoute,
    private router: Router,
    public toast: ToastComponent,
    private fileUploadService: FileUploadService,
    public ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit(): void {
    this.newsForm = this.fb.group({
      newsId: "new",
      news: "",
      photos: "",
      publishDateTime: ""
    });
    this.initNewsIdFromRouteParam();
    if (this.newsId != "new") {
      this.getNews();
      this.pageTitle = "Edit News";
    } else {
      this.pageTitle = "Create New News Post";
      this.isLoading = false;
      //TODO router guards (mode is in queryString)
    }
  }

  initNewsIdFromRouteParam(): void {
    // Get the newsId from the query params
    this.sub = this._route.queryParams.subscribe(params => {
      this.newsId = params["newsId"];
    });
  }
  getNews(): void {
    // Get the data with the newsId
    this.newsService
      .getSingleNews(this.newsId)
      .subscribe((news: INews) => this.onNewsRetrieved(news));
  }

  onNewsRetrieved(news: INews): void {
    if (this.newsForm) {
      this.newsForm.reset();
    }
    this.news = news;
    this.numberOfFiles = news.photos.length;
    if (this.numberOfFiles > 0) {
      this.showPhotoPanel = true;
      console.log("showphotopanel = true");
    }

    if (!this.news) {
      this.pageTitle = "Create New News Post";
    } else {
      this.pageTitle = "Edit News Post";
    }

    // Update the data on the form
    this.newsForm.patchValue({
      postId: this.newsId,
      news: this.news.news,
      scheduleDateTime: this.news.dateTimePublish,
      photos: this.news.photos
    });
    this.isLoading = false;
  }

  save(mode) {
    if (this.newsForm.dirty && this.newsForm.valid) {
      // Copy the form values over the news object values
      let p = Object.assign({}, this.news, this.newsForm.value);
      this.newsService
        .saveNews(p)
        .subscribe(
          () => this.onSaveComplete(mode),
          (error: any) => (this.errorMessage = <any>error)
        );
    }
    this.onSaveComplete(mode);
  }

  onSaveComplete(mode): void {
    this.router.navigate(["admin"]);
  }

  cancel() {
    this.router.navigate(["admin"]);
  }

  handleFileInput(files: FileList) {
    this.filesToUpload = files;
    try {
      this.uploadFilesToAPI();
      this.news.photos = Array.from(this.filesToUpload, x => x.name);
      this.numberOfFiles = this.news.photos.length;
      this.showPhotoPanel = this.numberOfFiles > 0;
    } catch (error) {
      this.handleError(error);
    }
    this.newsForm.markAsDirty();
    // TODO deal with duplicate filenames: currently the upload fails silently
    // TODO make the toaster work for errors
  }
  uploadFilesToAPI() {
    this.fileUploadService.postFiles(this.filesToUpload).subscribe(
      data => {
        // upload success
        this.toast.setMessage("Files uploaded successfully.", "success");
        this.newsForm.patchValue({ photos: this.news.photos });
      },
      error => {
        console.log(error);
      }
    );
  }

  openPhoto(photo: string) {
    window.open(AppSettings.API_ENDPOINT + "pictures/" + photo, "_blank");
  }
  handleError(error): void {
    this.toast.setMessage(`Dammit - error: ${error.toString()}`, "error");
  }

  doneButtonEnabled(): boolean {
    return (
      typeof this.bscalendarRef != "undefined" &&
      typeof this.bscalendarRef.getDate() != "undefined"
    );
  }

  scheduleNews(): void {
    this.scheduleDateTime = new Date(this.bscalendarRef.getDate());
    this.setModalData(this.scheduleDateTime);
  }

  setScheduleDateAndTime() {
    this.scheduleDateTime = new Date(this.bscalendarRef.getDate());
    this.setModalData(this.scheduleDateTime);
    this.setDateAndTimeLabel(this.scheduleDateTime);
    this.ngxSmartModalService.closeLatestModal();
  }

  setDateAndTimeLabel(_dateTime: Date): void {
    //this.newsForm.patchValue({publishDateTime: DateUtility.formatDate(_dateTime)});
    this.newsForm.controls["publishDateTime"].setValue(
      DateUtility.formatDate(_dateTime)
    );
    HtmlUtility.setElementValue(
      "publishDateTime",
      DateUtility.formatDate(_dateTime)
    );
  }

  setModalData(_date: Date) {
    this.ngxSmartModalService.setModalData(_date, "myModal");
  }

  scheduleForNow(): void {
    this.scheduleDateTime = new Date();
    this.setDateAndTimeLabel(this.scheduleDateTime);
  }

  getDateTimeForSchedule() {
    this.ngxSmartModalService.getModal("myModal").open();
  }
}
