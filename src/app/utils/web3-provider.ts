import { Injectable, InjectionToken, Inject } from '@angular/core';
import { providers } from 'ethers';

export const WEB3PROVIDER = new InjectionToken('Web3 provider', {
  providedIn: 'root',
  factory: () => (window as any).ethereum
});

@Injectable({ providedIn: 'root' })
export class Provider extends providers.Web3Provider {

  constructor(@Inject(WEB3PROVIDER) web3Provider: any) {
    super(web3Provider);
  }
}