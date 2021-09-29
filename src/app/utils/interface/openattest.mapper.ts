import { Issuer } from '@govtechsg/open-attestation/dist/types/__generated__/schema.2.0';

export interface IOpenAttest {
    name: string,
    issuers: Issuer[],
    recipient: IRecipient,
    $template: IOARenderer
};

export interface IOwnerProof {
    location: string,
    type: string
};

export interface IRecipient {
    name: string,
    FirstName: string,
    LastName: string,
    course: string
};

export interface IOARenderer {
    name: string,
    type: string,
    url: string
};