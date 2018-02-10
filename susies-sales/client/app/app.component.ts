import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import 'bootstrap/dist/js/bootstrap.bundle.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(public auth: AuthService) { }

}
