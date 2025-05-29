import { JSON } from '@klave/sdk';

@json
export class ErrorMessage {
    success!: boolean;
    message!: string;
}

@json
export class QuoteRequest {
    reportData!: Array<u8>; // Could be anything (challenge, nonce, etc.)
}

@json
export class QuoteBinary {
    quote!: Array<u8>;
}



