import { Component, ChangeDetectorRef } from "@angular/core";
import { AuthService } from "./services/auth.service";
import "bootstrap/dist/js/bootstrap.bundle.js";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})
export class AppComponent {
  constructor(public auth: AuthService, private cdRef: ChangeDetectorRef) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
}
