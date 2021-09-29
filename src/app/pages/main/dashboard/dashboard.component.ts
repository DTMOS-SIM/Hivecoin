import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/utils/services/web3service';
import { JsonRpcSigner } from '@ethersproject/providers';
import { UpgradableDocumentStore } from '@govtechsg/document-store';
import { IOpenAttest } from 'src/app/utils/interface/openattest.mapper';
import { ContractReceipt } from '@ethersproject/contracts';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  accounts: string = '';
  signer: any = null;
  address: any = '0xBBb8Ab885f8c7cE1ee48784D31BE78f211CAb4bB';
  deployedContractAddress: any = null;
  merkleRoot: any = null;
  fileUrl: any = null;
  documentStore!: UpgradableDocumentStore;
  newSigner: any = null;
  file: File | null = null;

  constructor(private web3Service: Web3Service, private sanitiser: DomSanitizer) {
  }

  async ngOnInit() {
    this.web3Service.getAccounts().asObservable().subscribe(async item => {
      this.accounts = item[0]
      this.signer = await this.getSigner();
      console.log(this.signer)
    });
    this.newSigner = await this.web3Service.newWalletFromEtherscan();
  }

  async getSigner(): Promise<JsonRpcSigner> {
    return await this.web3Service.getSigner(this.accounts).then((signer) => {
      return signer
    })
  }

  async handleFileInput(event: any) {
    this.file = event.files!.item(0);
    let reader: FileReader = new FileReader();
    if (this.file) {
      reader.readAsText(this.file);
      reader.onload = async (e) => {
        let loadFile = reader.result;
        let loadDoc: IOpenAttest = JSON.parse(loadFile as string);
        if (loadDoc) {
          this.wrapNsignDocument(loadDoc);
        }
      }
    }
  }

  async wrapNsignDocument(file: any) {
    try {
      console.log("Wrapping documents....");
      let wrappedDocument = this.web3Service.wrapDocument(file);
      console.log(wrappedDocument)
      if (wrappedDocument.message) {
        console.log(wrappedDocument)
      } else {
        console.log("Documents wrapped!");
        console.log("Signing documents....");
        let signedDocument = await this.web3Service.signWrappedDocument(wrappedDocument[0], this.signer);
        console.log(signedDocument)
        if (signedDocument.message) {
          console.log(signedDocument)
        } else {
          console.log("Documents signed!");
          let SchemaIntegrity = await this.web3Service.validateSchema(signedDocument)
          let SignatureIntegrity = await this.web3Service.validateSignature(signedDocument)
          if (SchemaIntegrity && SignatureIntegrity) {
            this.merkleRoot = signedDocument.proof[0].signature;
            const item = await this.encodeJson(signedDocument);
            this.fileUrl = this.sanitiser.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(item));
            alert("Documents verified and signed! Ready for deployment.")
          }
        }
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  loadJsonWallet(event: any) {
    this.file = event.files!.item(0);
    let reader: FileReader = new FileReader();
    if (this.file) {
      reader.readAsText(this.file);
      reader.onload = async (e) => {
        let loadFile = reader.result;
        let loadString = JSON.parse(loadFile as string);
        console.log(loadString);
      }
    }
  }

  async deployDocuments() {
    try {
      if (this.signer) {
        this.web3Service.deployDocumentStore(this.signer).then((result) => {
          this.address = result.address
        })
      }
    } catch (error: any) {
      console.log(error.message)
    }
  }

  async connectDocumentStore() {
    if (this.address) {
      this.web3Service.connectDocumentStore(this.address, this.signer).then((result) => {
        this.documentStore = result
        console.log(result)
      })
    }
  }

  async issueDocument() {
    if (this.documentStore && this.merkleRoot) {
      this.web3Service.issueDocument(this.documentStore, this.merkleRoot).then((result: ContractReceipt) => {
        console.log(result)
        this.deployedContractAddress = result.contractAddress;
      })
    }
  }

  async encodeJson(obj: any): Promise<Blob> {
    const str = JSON.stringify(obj);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: "application/json;charset=utf-8"
    });
    return blob
  }
}