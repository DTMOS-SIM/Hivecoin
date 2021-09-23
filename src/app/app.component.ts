import { Component } from '@angular/core';
import { SimpleStorageContract } from './utils/contract';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'HivecoinApp';
  constructor(private contract: SimpleStorageContract) {}
}
