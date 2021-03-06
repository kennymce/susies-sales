import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { PostService } from "../services/post.service";
import { ToastComponent } from "../shared/toast/toast.component";
import { Post } from "../shared/models/post.model";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { User } from "../shared/models/user.model";
import { SelectionModel } from "@angular/cdk/collections";
import { ViewChild } from "@angular/core";
import { CalendarControlComponent } from "../shared/calendar-control/calendar-control.component";
import { NgxSmartModalService } from "ngx-smart-modal";
import { TableDataSource } from "angular4-material-table";
import { DateUtility } from '../shared/utility/date';

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
  providers: []
})
export class PostsComponent implements OnInit {
  post = new Post();
  posts: Post[] = [];
  user: User;
  selectedPosts: Post[] = [];
  isLoading = true;
  initialSelection = [];
  allowMultiSelect = true;
  columnsToDisplay = [];

  public scheduledOnly: boolean = false;

  selection = new SelectionModel<Post>(
    this.allowMultiSelect,
    this.initialSelection
  );
  scheduledRows = [];

  @ViewChild("bscalendar") bscalendarRef: CalendarControlComponent;
  @Output() postListChange = new EventEmitter<Post[]>();

  dataSource: TableDataSource<Post>;
  internalDataSource: Post[];

  constructor(
    private postService: PostService,
    public toast: ToastComponent,
    private router: Router,
    public auth: AuthService,
    private userService: UserService,
    public ngxSmartModalService: NgxSmartModalService
  ) {}

  ngOnInit() {
    this.getUser();
  }

  ngAfterViewChecked() {
    if (document.getElementById("unscheduledPostsOnly") != undefined) {
      this.setScheduledLabelVisbility();
    }
  }

  getScheduledPosts() {
    for (let i = 0; i < this.posts.length; i++) {
      if (this.posts[i].dateTimePublish) {
        this.scheduledRows.push(this.posts[i]);
      }
    }
  }

  getUser() {
    this.userService
      .getUser(this.auth.currentUser)
      .subscribe(
        data => (this.user = data),
        error => console.log(error),
        () => this.onGetUserComplete()
      );
  }

  onGetUserComplete() {
    if (this.user.role == "admin") {
      this.columnsToDisplay = [
        "description",
        "from",
        "size",
        "price",
        "actions",
        "select",
        "dateTimePublish"
      ];
    } else {
      this.columnsToDisplay = [
        "description",
        "from",
        "size",
        "price",
        "actions"
      ];
    }
    this.getPosts(true);
  }

  getPosts(scheduled: boolean) {
    this.postService
      .getPosts(scheduled)
      .subscribe(
        data => (this.posts = data),
        error => console.log(error),
        () => this.onGetPostsComplete(scheduled)
      );
  }

  onGetPostsComplete(scheduled: boolean) {
    this.scheduledOnly = scheduled;
    this.internalDataSource = this.posts;
    this.dataSource = new TableDataSource<any>(this.posts, Post);
    this.dataSource.datasourceSubject.subscribe(posts =>
      this.postListChange.emit(posts)
    );
    this.isLoading = false;
    this.getScheduledPosts();
  }

  goEditPost(row: any) {
    this.router.navigate(["rct-post/rct-post"], {
      queryParams: { postId: row.currentData.postId }
    });
  }

  goVeiwPost(row: any) {
    this.router.navigate(["rct-post/view-post"], {
      queryParams: { postId: row.currentData.postId, mode: "view" }
    });
  }

  goCreatePost(): void {
    this.router.navigate(["rct-post/rct-post"], {
      queryParams: { postId: "new" }
    });
  }

  deletePost(row) {
    if (
      window.confirm("Are you sure you want to permanently delete this item?")
    ) {
      let post = row.currentData;
      this.postService.deletePost(post).subscribe(
        () => {
          const pos = this.posts.map(elem => elem._id).indexOf(post._id);
          this.posts.splice(pos, 1);
          this.toast.setMessage("item deleted successfully.", "success");
          this.dataSource.getRow(row.id).cancelOrDelete();
        },
        error => console.log(error)
      );
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.internalDataSource.length;
    console.log(`numRows = ${numRows}, numSelected = ${numSelected}`);
    console.log(`IsAllSelected: ${numSelected == numRows}`);
    return numSelected == numRows;
  }

  isNoneSelected() {
    return this.selection.selected.length === 0;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.internalDataSource.forEach(row => {
          this.selection.select(row);
          // TODO selection model doesn't work with material.
          // https://stackoverflow.com/questions/47349528/binding-an-angular-material-selection-list
          console.log(`selecting row: ${row.toString()}`);
        });
    if (this.isAllSelected()) {
      // add all posts to selectedPosts
      this.selectedPosts = this.internalDataSource;
    } else if (!this.isAllSelected()) {
      this.selectedPosts = [];
    }
  }

  selectPostRow(row: any, isSelected: boolean) {
    console.log(row.currentData);
    console.log(`isSelected: ${isSelected}`);
    if (isSelected) {
      this.selectedPosts.push(row.currentData);
    } else if (!isSelected) {
      this.selectedPosts.splice(row.currentData);
    }
  }

  // END Material table logic

  schedulePosts(_dateTime: Date) {
    this.selectedPosts.forEach(function(item) {
      item.dateTimePublish = new Date(_dateTime);
    });
    this.ngxSmartModalService.closeLatestModal();
  }

  getDateTimeForSchedule() {
    this.ngxSmartModalService.getModal("myModal").open();
  }

  setModalData(_date: Date) {
    this.ngxSmartModalService.setModalData(_date, "myModal");
  }

  setScheduleDateAndTime() {
    let scheduleDateTime = new Date(this.bscalendarRef.getDate());
    // Doesn't matter that these are asynchronous operations since we don't care about the order they execute
    this.setModalData(scheduleDateTime);
    this.schedulePosts(scheduleDateTime);
    this.doSchedulePosts(scheduleDateTime);
  }

  doSchedulePosts(_dateTime: Date) {
    let postIds = this.selectedPosts.map(posts => posts._id);
    this.postService.schedulePosts(postIds, _dateTime).subscribe(
      res => {
        this.toast.setMessage("post added successfully.", "success");
      },
      error => console.log(error)
    );
  }

  doneButtonEnabled(): boolean {
    return (
      typeof this.bscalendarRef != "undefined" &&
      typeof this.bscalendarRef.getDate() != "undefined"
    );
  }

  setScheduledLabelVisbility() {
    if (this.scheduledOnly) {
      document.getElementById("unscheduledPostsOnly").style.visibility =
        "hidden";
    } else {
      document.getElementById("unscheduledPostsOnly").style.visibility =
        "visible";
    }
  }

  showHideScheduledPosts(): void {
    this.getPosts(!this.scheduledOnly);
  }

  formatDate(dateString){
    if (dateString != undefined) {
      const theDate = new Date(dateString)
      return DateUtility.formatDate(theDate);
    } else
      return null;
  }
}
