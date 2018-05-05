import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { PrivateMessage } from "../shared/models/privateMessage.model";
import { PrivateMessageService } from "../services/private-message.service";
import { ToastComponent } from "../shared/toast/toast.component";
import { IPrivateMessage } from "../privateMessage/privateMessage";
import { NgxSmartModalService } from "ngx-smart-modal";
import { AuthService } from "../services/auth.service";
import { User } from "../shared/models/user.model";
import { UserService } from "../services/user.service";
import { TableDataSource } from "angular4-material-table";
import { HtmlUtility } from "../shared/utility/html";

@Component({
  selector: "app-private-messages",
  templateUrl: "./private-messages.component.html",
  styleUrls: ["./private-messages.component.css"]
})
export class PrivateMessagesComponent implements OnInit {
  isLoading = true;
  privateMessages: PrivateMessage[] = [];
  user: User;
  replyToUser: string;
  privateMessage : PrivateMessage;

  constructor(
    private privateMessageService: PrivateMessageService,
    public toast: ToastComponent,
    public ngxSmartModalService: NgxSmartModalService,
    private userService: UserService,
    private auth: AuthService
  ) {}

  @Output() privateMessageListChange = new EventEmitter<PrivateMessage[]>();

  dataSource: TableDataSource<PrivateMessage>;

  ngOnInit() {
    this.getUser();
  }

  getPrivateMessages(): void {
    this.privateMessageService
      .getPrivateMessagesForUser(this.user.username)
      .subscribe((privateMessages: IPrivateMessage[]) =>
        this.onPrivateMessagesRetrieved(privateMessages)
      );
  }

  onPrivateMessagesRetrieved(privateMessages): void {
    this.privateMessages = privateMessages;
    this.isLoading = false;
    console.log(this.privateMessages);
    this.dataSource = new TableDataSource<any>(
      this.privateMessages,
      privateMessages
    );
    this.dataSource.datasourceSubject.subscribe(privateMessages =>
      this.privateMessageListChange.emit(privateMessages)
    );
  }

  columnsToDisplay = [
    "userId",
    "toUser",
    "message",
    "actions",
    "dateTimeOfMessage"
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
    this.getPrivateMessages();
    this.isLoading = false;
  }

  setModalData(data: any) {
    this.ngxSmartModalService.getModal("myModal").open();
    this.ngxSmartModalService.setModalData(data.currentData, "myModal");
    this.privateMessage = data.currentData;
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

  getReplyToUser(): string {
  return this.replyToUser;
  }

  handleDelete(row) {
    if (
      window.confirm("Are you sure you want to permanently delete this message?")
    ) {
      this.dataSource.getRow(row.id).cancelOrDelete();
      this.goDeletePrivateMessage(row.currentData);
    }
  }
}
