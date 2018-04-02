import { Component, OnInit, Input } from "@angular/core";
import { NgxSiemaOptions, NgxSiemaService } from "ngx-siema";
import { AppSettings } from "../appSettings";

@Component({
  selector: "app-carousel",
  templateUrl: "./carousel.component.html",
  styleUrls: ["./carousel.component.css"]
})
export class CarouselComponent implements OnInit {
  @Input() photos;

  photoRoot: string = AppSettings.API_ENDPOINT + "pictures/";

  options: NgxSiemaOptions = {
    selector: ".siema"
  };

  constructor(private ngxSiemaService: NgxSiemaService) {}

  prev() {
    this.ngxSiemaService.prev(1).subscribe((data: any) => console.log(data));
  }

  next() {
    this.ngxSiemaService.next(1).subscribe((data: any) => console.log(data));
  }

  goTo() {
    this.ngxSiemaService.goTo(1).subscribe((data: any) => console.log(data));
  }

  returnPhotoURI(photo): String {
    let str;
    str = AppSettings.API_ENDPOINT + "pictures/" + encodeURIComponent(photo);
    return str;
  }

  ngOnInit() {}
}
