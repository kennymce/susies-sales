import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { News } from "../../shared/models/news.model";
import { User } from "../../shared/models/user.model";
import { NewsService } from '../../services/news.service';

@Component({
  selector: "news-element",
  templateUrl: "./news-element.component.html",
  styleUrls: ["./news-element.component.css"],
  outputs: ["onNewsStoryDeleted"]
})
export class NewsElementComponent implements OnInit {
  @Input() newsStory: News;
  @Input() user: User;
  @Output() onNewsStoryDeleted = new EventEmitter();

  constructor(
    private newsService: NewsService
  ) {}

  ngOnInit() {}

  deleteNewsStory(newsStory) {
    console.log(`the news story is: ${newsStory.news}`);
    this.newsService.deleteNews(newsStory);

    this.newsService.deleteNews(newsStory).subscribe(
      () => {
        console.log('news story deleted');
        this.onNewsStoryDeleted.emit();
      },
      error => console.log(error)
    );
  }
}
