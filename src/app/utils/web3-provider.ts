import { Injectable, InjectionToken, Inject } from '@angular/core';
import detectEthereumProvider from '@metamask/detect-provider';
import { providers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

export const WEB3PROVIDER = new InjectionToken('Web3 provider', {
  providedIn: 'root',
  factory: () => (window as any).ethereum
});

@Injectable({ providedIn: 'root' })
export class Provider extends providers.Web3Provider {

  public accounts$ = new BehaviorSubject<Array<string>>([]);
  public chains$ = new BehaviorSubject<string>("");

  constructor(@Inject(WEB3PROVIDER) web3Provider: any) {
    super(web3Provider);
    this.metaMaskDetector(web3Provider);
  }

  async metaMaskDetector(web3Provider: providers.Web3Provider) {
    const provider = await detectEthereumProvider() as any
    if (provider) {

      web3Provider.on('accountsChanged',(accounts: Array<string>) => {
        // Handle the new accounts, or lack thereof.
        console.log("Accounts Changed")
        this.accounts$.next(accounts);
      });
      
      web3Provider.on('chainChanged', () => {
        // Handle the new chain.
        console.log("Chain Changed")
        window.location.reload();
      });
      console.log('Ethereum successfully detected!')
    } else {
      console.error('Please install MetaMask!')
    }
  }
}