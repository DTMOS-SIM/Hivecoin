import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { Observable } from 'rxjs';
import { Web3Service } from 'src/app/utils/services/web3service';
import { AppSigner } from '../../../../app/utils/app-signer';


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
  accounts: Array<string> = [];
  signer: any = null;
  file: File | null = null;

  constructor(private web3Service: Web3Service) {
  }

  async ngOnInit() {
    await this.web3Service.getAccounts().then((acct) => {
      this.accounts.push(acct[0]);
    }).catch(error => console.log(error))
    await this.web3Service.getSigner(this.accounts[0]).then((signer) => {
      this.signer = signer
      console.log(this.signer)
    })
  }

  handleFileInput(event: any) {
    this.file = event.files!.item(0);
    let reader: FileReader = new FileReader();
    if (this.file) {
      reader.readAsText(this.file);
      reader.onload = (e) => {
        let loadFile = reader.result;
        console.log(loadFile)
        let loadString = JSON.stringify(loadFile);
        console.log(loadString);
      }
    }
  }

  async deployDocuments() {
    try {
      if (this.signer) {
        this.web3Service.deployDocumentStore(this.signer).then((result) => {
          console.log(result)
        })
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }
}