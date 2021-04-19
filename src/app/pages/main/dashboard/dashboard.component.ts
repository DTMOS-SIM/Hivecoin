import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../../utils/services/web3service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  User = {
    name: "",
    year: 0,
    owner: null
  }

  constructor(private web3Service: Web3Service) {
    console.log('Constructor: ' + web3Service);
  }

  getUser() {
    this.web3Service.getUser().then(data => {
      this.User.year = data.year ?? data.year | 0;
      this.User.name = data.name;
      this.User.owner = data.owner;
    }).catch(error => {
      window.alert(error)
    });
  }

  setUser() {
    this.web3Service.setUser(this.User.name, this.User.year).then((data) => {
      console.log("successfully completed with: " + data)
    }).catch(error => {
      window.alert(error)
    });
  }

  ngOnInit(): void {}
}