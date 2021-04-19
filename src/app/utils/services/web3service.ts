import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { promise } from 'selenium-webdriver';
import { environment } from '../../../environments/environment';
declare let require: any;
const Web3 = require('web3');
const contract = require('@truffle/contract');

declare let window: any;

@Injectable()
export class Web3Service {

  private web3: any;
  private accounts: string[] = [];
  public accountsObservable = new Subject<string[]>();

  constructor() {
    window.addEventListener('load', () => {
      this.web3Initialiser();
    });
  }

  public async web3Initialiser() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        this.web3 = new Web3(window.ethereum);
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
        }
      } finally {
        this.refreshAccounts().then((data: Array<string>) => {
          // Get the initial account balance so it can be displayed.
          if (data.length === 0) {
            window.alert("Metamask is not connected");
          }

          if (
            !this.accounts ||
            this.accounts.length !== data.length ||
            this.accounts[0] !== data[0]
          ) {
            console.log('Observed new accounts');
            this.accountsObservable.next(data);
            this.accounts = data;
          }
        });
      }
    } else {
      try {
        this.web3 = new Web3(
          new Web3.providers.HttpProvider('http://localhost:7545')
        );
      } catch (error) {
        if (error.code === 4001) {
          // User rejected request
        }
        console.log(error);
      }
    }
  }

  async getUser() : Promise<any> {
    return new this.web3.eth.Contract(
      environment.abiSpecification,
      environment.contractAddress
    ).methods
      .getUser(this.accounts[0])
      .call(function (error: any, result: any) {
        if (!error) {
          Promise.resolve(result)
        } else {
          Promise.reject(error)
        }
      });
  }

  async setUser(firstName: string, age: number): Promise<string> {
    return await new this.web3.eth.Contract(
      environment.abiSpecification,
      environment.contractAddress
    ).methods
      .setUser(firstName, age)
      .send({ from: this.accounts[0] }, function (error: any, result: any) {
        if (!error) {
          Promise.resolve(result);          
        } else {
          Promise.reject(error);
        }
      });
  }

  private async refreshAccounts(): Promise<Array<string>> {
    const accs = await this.web3.eth.getAccounts();
    console.log('Refreshing accounts');
    return accs;
  }
}
