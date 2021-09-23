import { Injectable } from '@angular/core';
import { Contract } from 'ethers';
import { AppSigner } from './app-signer';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class SimpleStorageContract extends Contract {
  constructor(appSigner: AppSigner) {
    super(environment.contractAddress, environment.abiSpecification, appSigner);
  }
}