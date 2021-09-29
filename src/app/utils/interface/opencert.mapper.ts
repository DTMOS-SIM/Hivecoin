import { Issuer } from '@govtechsg/open-attestation/dist/types/__generated__/schema.2.0';

export interface IOpenCert {
    name: string,
    issuers: Issuer[],
    recipient: IRecipient,
    $template: IOARenderer,
    id: string,
    description: string,
    issuedOn: string,
    admissionDate: string,
    graduationDate: string,
    transcript: ITranscript,
    additionalData: IAdditional
};

export interface ITranscript {
    name: string,
    grade: string,
    courseCredit: string,
    courseCode: string,
    examinationDate: string,
    semester: string
};

export interface IopencertIssuer extends Issuer {
    url: string,
}
export interface IAdditional {
    merit: string,
    studentId: string,
    transcriptId: string
}

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