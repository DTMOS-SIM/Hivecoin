import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Signer, Wallet, providers, ContractReceipt } from "ethers";
import { Provider } from '../web3-provider';
import { connect, deployAndWait, UpgradableDocumentStore } from '@govtechsg/document-store';
import { wrapDocuments, signDocument, SUPPORTED_SIGNING_ALGORITHM, verifySignature } from "@govtechsg/open-attestation";
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';


@Injectable({ providedIn: 'root' })
export class Web3Service {

  constructor(@Inject(Provider) public webprovider: Provider) { }

  /**
    * Nothing stored in web3service
    * @param json string
    * @param password string
    * @description retrieved Signer abstract data as JsonRPCSigner (concrete) via *.json file
    * @returns Promise of Wallet Class
    */
  async getUserSigner(json: string, password: string): Promise<Wallet> {
    let signer = await Wallet.fromEncryptedJsonSync(json, password);
    return signer;
  }

  /**
    * Nothing stored in web3service
    * @param signer Signer
    * @description deployment of document store to network
    * @returns Promise of Wallet Class
    */
  async deployDocumentStore(signer: Signer): Promise<UpgradableDocumentStore> {
    const doc = await deployAndWait("Test Store", signer);
    return doc;
  }

  /**
    * Nothing stored in web3service
    * @description returns a list of users from metamask.
    * @returns BehaviorSubject of account users
    */
  getAccounts(): BehaviorSubject<string[]> {
    if (this.webprovider.accounts$.observers.length < 1) {
      console.log("new accounts");
      this.webprovider.listAccounts().then((data) => {
        this.webprovider.accounts$.next(data);
      });
    }
    return this.webprovider.accounts$;
  }

  /**
    * Nothing stored in web3service
    * @param acct Signer
    * @description retrieve user as JsonPprcSigner from account address
    * @returns Promise of JsonPprcSigner class
    */
  async getSigner(acct: string) {
    return await this.webprovider.getSigner(acct);
  }

  /**
    * Nothing stored in web3service
    * @param acct Signer
    * @description retrieve user as JsonPprcSigner from account address
    * @returns Promise of JsonPprcSigner class
    */
  wrapDocument(document: any): any {
    try {
      let rngId = uuidv4() as string;
      let wrappedDocuments = wrapDocuments([document, { ...document, id: rngId }]);
      // will ensure document is valid regarding open-attestation 2.0 schema
      return wrappedDocuments
    } catch (error: any) {
      return error.message
    }

  }

  /**
    * Nothing stored in web3service
    * @param document Wrapped document
    * @param signer Signer
    * @description sign a wrapped document with the current signer
    * @returns Promise of any
    */
  async signWrappedDocument(document: any, signer: Signer): Promise<any> {
    try {
      const signedDoc = signDocument(document, SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018, signer);
      return signedDoc
    } catch (error: any) {
      return error.message
    }
  }

  /**
    * Nothing stored in web3service
    * @param wrappedDocument Wrapped document
    * @description validate schema of a signed and wrapped document
    * @returns Promise of boolean
    */
  async validateSchema(wrappedDocument: any): Promise<boolean>  {
    const verified = await verifySignature(wrappedDocument);
    return verified
  }

  /**
    * Nothing stored in web3service
    * @param wrappedDocument Wrapped document
    * @description validate signature a signed and wrapped document
    * @returns Promise of boolean
    */
  async validateSignature(wrappedDocument: any): Promise<boolean>  {
    const verified = await verifySignature(wrappedDocument);
    return verified
  }
  /**
    * Nothing stored in web3service
    * @description create a new wallet from EtherscanProvider
    * @returns Wallet class
    */
  async newWalletFromEtherscan() {
    const provider = new providers.EtherscanProvider(environment.network.ropsten, environment.etherscanId);
    const wallet = Wallet.createRandom();
    const connectedWallet = wallet.connect(provider)
    return connectedWallet
  }

  /**
    * Nothing stored in web3service
    * @param signer Wallet
    * @description connecting to document store via Wallet information
    * @returns Promise of UpgradableDocumentStore
    */
  async connectDocumentStore(contractAddress: string, signer: Wallet): Promise<UpgradableDocumentStore> {
    const documentStore = await connect(contractAddress, signer);
    return documentStore
  }

  /**
   * Nothing stored in web3service
   * @param documentStore: UpgradableDocumentStore
   * @returns Promise of ContractReceipt interface
   */
  async issueDocument(documentStore: UpgradableDocumentStore, address: string): Promise<ContractReceipt> {
    const tx = await documentStore.issue(address);
    const receipt = await tx.wait();
    return receipt
  }

}
