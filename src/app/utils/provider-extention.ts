import { Injectable } from '@angular/core';
import { providers } from 'ethers';
import { environment } from 'src/environments/environment';
import { Network } from "@ethersproject/networks"


@Injectable({ providedIn: 'root' })
export class Provider extends providers.BaseProvider {

  constructor() {
    let network = environment.network as unknown as Network
    super(network);
  }
  // Implement custom method here
}