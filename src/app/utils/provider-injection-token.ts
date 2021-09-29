import { InjectionToken } from '@angular/core';
import { getDefaultProvider } from 'ethers';
import { environment } from 'src/environments/environment';

export const PROVIDER = new InjectionToken('Ethereum Provider', {
    providedIn: 'root',
    factory: () => getDefaultProvider(environment.network.custom)
});