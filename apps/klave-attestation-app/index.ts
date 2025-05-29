import { Notifier, Attestation, Context, Crypto } from '@klave/sdk';
import { ErrorMessage, QuoteRequest, QuoteBinary } from './types';

/**
 * @query
 */
export function getQuote(input: QuoteRequest): void {
    if( input.reportData.length != 64) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: `Invalid reportData length, expected 64 bytes`
        });
        return;
    }

    let quoteResult = Attestation.getQuote(input.reportData);
    if (quoteResult.err) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: quoteResult.err!.message
        });
        return;
    }
    let quote = Crypto.Utils.convertToU8Array(quoteResult.data!);

    Notifier.sendJson<QuoteBinary>({
        quote
    });
}

/**
 * @query
 */
export function parseQuote(input: QuoteBinary): void {
    if( input.quote.length === 0) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: `Quote is empty`
        });
        return;
    }

    let quoteResult = Attestation.parseQuote(Crypto.Utils.convertToUint8Array(input.quote));
    if (quoteResult.err) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: quoteResult.err!.message
        });
        return;
    }
    let parsedQuote = quoteResult.data!;
    Notifier.sendJson(parsedQuote);
}

/**
 * @query
 */
export function verifyQuote(input: QuoteBinary): void {
    let time = Context.get("trusted_time");
    let intValue: i64 = parseInt(time) as i64;

    let verifyResult = Attestation.verifyQuote(intValue, Crypto.Utils.convertToUint8Array(input.quote));
    if (verifyResult.err) {
        Notifier.sendJson<ErrorMessage>({
            success: false,
            message: verifyResult.err!.message
        });
        return;
    }

    Notifier.sendJson(verifyResult.data!);
}
