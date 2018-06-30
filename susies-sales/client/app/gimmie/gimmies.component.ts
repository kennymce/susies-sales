import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";
import { PrivateMessage } from "../shared/models/privateMessage.model";
import { ToastComponent } from "../shared/toast/toast.component";
import { IPrivateMessage } from "../privateMessage/privateMessage";
import { NgxSmartModalService } from "ngx-smart-modal";
import { AuthService } from "../services/auth.service";
import { User } from "../shared/models/user.model";
import { UserService } from "../services/user.service";
import { TableDataSource } from "angular4-material-table";
import { HtmlUtility } from "../shared/utility/html";
import { Gimmie } from "../shared/models/gimmie.model";
import { GimmieService } from "../services/gimmie.service";
import { IGimmie } from "./gimmie";
import { PrivateMessageService } from "../services/private-message.service";

@Component({
  selector: 'app-gimmies',
  templateUrl: './gimmies.component.html',
  styleUrls: ['./gimmies.component.css']
})
export class GimmiesComponent implements OnInit {
  isLoading = true;
  gimmies: Gimmie[] = [];
  user: User;
  replyToUser: string;
  gimmie: Gimmie;
  privateMessage: PrivateMessage;

  constructor(
    private gimmieService: GimmieService,
    private privateMessageService: PrivateMessageService,
    public toast: ToastComponent,
    private router: Router,
    public ngxSmartModalService: NgxSmartModalService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  @Output() gimmieListChange = new EventEmitter<Gimmie[]>();

  dataSource: TableDataSource<Gimmie>;

  ngOnInit() {
    this.getUser();
  }

  getGimmies(): void {
    this.gimmieService
      .getGimmies()
      .subscribe((gimmies: IGimmie[]) =>
        this.onGimmiesRetrieved(gimmies)
      );
  }

  onGimmiesRetrieved(gimmies): void {
    this.gimmies = gimmies;
    this.isLoading = false;
    this.dataSource = new TableDataSource<any>(
      this.gimmies,
      gimmies
    );
    this.dataSource.datasourceSubject.subscribe(gimmmies =>
      this.gimmieListChange.emit(gimmies)
    );
  }

  columnsToDisplay = [
    "userId",
    "description",
    "from",
    "dateTimeRequested",
    "read"
  ];

  getUser() {
    console.log("getUser...");
    this.userService
      .getUser(this.auth.currentUser)
      .subscribe(
        data => (this.user = data),
        error => console.log(error),
        () => this.onGetUserComplete()
      );
  }

  onGetUserComplete() {
    this.getGimmies();
    this.isLoading = false;
  }

  setModalData(data: any) {
    this.ngxSmartModalService.getModal("myModal").open();
    this.ngxSmartModalService.setModalData(data.currentData, "myModal");
    this.gimmie = data.currentData;
    this.replyToUser = data.currentData.userId;
  }

  cancelPrivateMessage() {
    HtmlUtility.resetElementValue("privateMessageText");
    this.ngxSmartModalService.getModal("myModal").close();
  }

  handlePrivateMessage() {
    let privateMessage = this.privateMessage;
    let privateMessageText = HtmlUtility.getElementValue("privateMessageText");
    if (privateMessageText.length > 0) {
      let _privateMessage = new PrivateMessage(
        "new",
        this.user.username,
        privateMessage.userId, // userId of the user who sent the original message
        privateMessage.postId, // postId of the subject Post
        privateMessageText
      );
      console.log("Saving privateMessage: ", _privateMessage);
      this.savePrivateMessage(_privateMessage);
    }
    HtmlUtility.resetElementValue("privateMessageText");
    console.log(`privateMessageText - debug: ${privateMessageText}`);
    this.ngxSmartModalService.closeLatestModal();
    this.ngxSmartModalService.resetModalData("myModal");
  }

  savePrivateMessage(_privateMessage: IPrivateMessage) {
    this.privateMessageService.savePrivateMessage(_privateMessage).subscribe(
      res => {
        this.toast.setMessage("Righto!", "success");
      },
      error => console.log(error)
    );
  }

  /*


    goDeletePrivateMessage(_privateMessage: IPrivateMessage): void {
      this.privateMessageService
        .deletePrivateMessage(_privateMessage.privateMessageId)
        .subscribe(
          () => {
            const pos = this.privateMessages
              .map(elem => elem._id)
              .indexOf(_privateMessage.privateMessageId);
            this.privateMessages.splice(pos, 1);
            this.toast.setMessage("item deleted successfully.", "success");
          },
          error => console.log(error)
        );
    }

    handleDelete(row) {
      if (
        window.confirm("Are you sure you want to permanently delete this message?")
      ) {
        this.dataSource.getRow(row.id).cancelOrDelete();
        this.goDeletePrivateMessage(row.currentData);
      }
    }
  */

  goVeiwPost(row: any) {
    this.router.navigate(["rct-post/view-post"], {
      queryParams: { postId: row.currentData.postId, mode: "view" }
    });
  }

  getReplyToUser(): string {
    return this.replyToUser;
  }
}
