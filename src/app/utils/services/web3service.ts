import { Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BigNumber, providers, Signer, Wallet } from "ethers";
import { Provider } from '../web3-provider';
import { deploy, deployAndWait } from '@govtechsg/document-store/src';

@Injectable({ providedIn: 'root' })
export class Web3Service {

  private wallet!: Wallet;
  public accountsObservable = new Subject<string[]>();
  balance: BigNumber | undefined;

  constructor(@Inject(Provider) public webprovider: providers.Web3Provider) {}

  async deployDocumentStore(signer: Signer) {
    const doc = await deployAndWait("My Document Store", signer);
    return doc;
  }

  async getAccounts() {
    return await this.webprovider.listAccounts();
  }

  async getSigner(acct: string) {
    return await this.webprovider.getSigner(acct);
  }

  async getUser() {
  }

  async setUser(firstName: string, age: number) {
  }

}
