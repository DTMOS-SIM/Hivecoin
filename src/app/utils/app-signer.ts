import { Inject, Injectable } from '@angular/core';
import { Signer, utils, providers, Wallet, Bytes } from 'ethers';
import { Provider } from './provider-extention';

@Injectable({ providedIn: 'root' })
export class AppSigner extends Signer {

  private wallet!: Wallet;

  constructor(@Inject(Provider) public provider: providers.BaseProvider) {
    super();
  }

  async login(password: string) {
    const wallet = await Wallet.fromEncryptedJson(localStorage.get('wallet'), password);
    this.wallet = wallet.connect(this.provider);
    console.log(this.wallet)
  }

  getAddress(): Promise<string> {
    return this.wallet.getAddress()
  }

  signMessage(message: Bytes | string): Promise<string> {
    return this.wallet.signMessage(message);
  }

  sendTransaction(transaction: providers.TransactionRequest): Promise<providers.TransactionResponse> {
    return this.wallet.sendTransaction(transaction);
  }

  signTransaction(transaction: utils.Deferrable<providers.TransactionRequest>): Promise<string> {
    throw new Error('Method not implemented.');
  }
  connect(provider: providers.Provider): Signer {
    throw new Error('Method not implemented.');
  }
}