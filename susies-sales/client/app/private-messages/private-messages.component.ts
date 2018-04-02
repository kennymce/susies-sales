import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { PrivateMessage } from "../shared/models/privateMessage.model";
import { PrivateMessageService } from "../services/private-message.service";
import { ToastComponent } from "../shared/toast/toast.component";
import { IPrivateMessage } from "../privateMessage/privateMessage";
import { NgxSmartModalService } from "ngx-smart-modal";
import { AuthService } from "../services/auth.service";
import { AppSettings } from "../appSettings";
import { User } from "../shared/models/user.model";
import { UserService } from "../services/user.service";
import { TableDataSource } from "angular4-material-table";

@Component({
  selector: "app-private-messages",
  templateUrl: "./private-messages.component.html",
  styleUrls: ["./private-messages.component.css"]
})
export class PrivateMessagesComponent implements OnInit {
  selectedMessages: PrivateMessage[] = [];
  isLoading = true;
  initialSelection = [];
  allowMultiSelect = true;
  privateMessages: PrivateMessage[] = [];
  user: User;

  selection = new SelectionModel<PrivateMessage>(
    this.allowMultiSelect,
    this.initialSelection
  );

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
    this.getPrivateMessages();
    this.getUser();
  }

  getPrivateMessages(): void {
    // Get the data with the postId
    this.privateMessageService
      .getPrivateMessages()
      .subscribe((privateMessages: IPrivateMessage[]) =>
        this.onPrivateMessagesRetrieved(privateMessages)
      );
  }

  onPrivateMessagesRetrieved(privateMessages): void {
    this.privateMessages = privateMessages;
    this.isLoading = false;
    console.log(this.privateMessages);
    //this.dataSource = this.privateMessages;
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
    console.log("onGetUserComplete...");
    this.isLoading = false;
  }

  privateMessage() {
    this.ngxSmartModalService.getModal("myModal").open();
  }

  setModalData(privateMessage: PrivateMessage) {
    console.log("Setting modal data to: ", privateMessage.toString());
    this.ngxSmartModalService.getModal("myModal").open();
    this.ngxSmartModalService.setModalData(privateMessage, "myModal");
  }

  handlePrivateMessage(privateMessage: PrivateMessage) {
    let privateMessageText = (<HTMLInputElement>document.getElementById(
      "privateMessageText"
    )).value;
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
    this.ngxSmartModalService.closeLatestModal();
    this.ngxSmartModalService.resetModalData("myModal");
  }

  savePrivateMessage(_privateMessage: IPrivateMessage) {
    // save the user
    this.privateMessageService.savePrivateMessage(_privateMessage).subscribe(
      res => {
        this.toast.setMessage("Righto!", "success"); //TODO toaster doesn't work here
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

  handleDelete(row) {
    if (
      window.confirm("Are you sure you want to permanently delete this item?")
    ) {
      this.dataSource.getRow(row.id).cancelOrDelete();
      this.goDeletePrivateMessage(row.currentData);
    }
  }

  refreshTbale() {
    // TODO does not refresh. Also, need to do this in posts.component
    this.privateMessageService
      .getPrivateMessages()
      .subscribe((privateMessages: IPrivateMessage[]) => this.dataSource);
  }
}
