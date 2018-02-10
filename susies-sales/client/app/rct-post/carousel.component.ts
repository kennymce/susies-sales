import { Component, OnInit, Input } from '@angular/core';
import { NgxSiemaOptions, NgxSiemaService } from 'ngx-siema';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() photos;

  // TODO find a way to derive this instead of a hard coded uri
  photoRoot: string = 'http://localhost:3000/api/pictures/';

  options: NgxSiemaOptions = {
    selector: '.siema',
  };

  constructor(private ngxSiemaService: NgxSiemaService) {
  }

  prev() {
    this.ngxSiemaService.prev(1)
      .subscribe((data: any) => console.log(data));
  }

  next() {
    this.ngxSiemaService.next(1)
      .subscribe((data: any) => console.log(data));
  }

  goTo() {
    this.ngxSiemaService.goTo(1)
      .subscribe((data: any) => console.log(data));
  }

  returnPhotoURI(photo): String {
    let str;
    str = 'http://localhost:3000/api/pictures/' + encodeURIComponent(photo);
    return (str);
    // return ('http://localhost:3000/api/pictures/2015-04-07%10.51.11.jpg');
  }

  ngOnInit() {
  }
}

