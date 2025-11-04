declare module '@hipay/hipay-enterprise-sdk-nodejs' {
    interface HiPayOptions {
        apiToken?: string | null;
        apiUsername?: string | null;
        apiPassword?: string | null;
        apiEnv?: string;
        apiHTTPHeaderAccept?: string;
        proxy?: {
            host?: string;
            port?: number;
            auth?: {
                username?: string;
                password?: string;
            };
        };
        timeout?: number;
        httpUserAgent?: string;
    }

    interface Transaction {
        [key: string]: unknown;
    }

    class HiPay {
        static readonly API_ENV_STAGE: string;
        static readonly API_ENV_PRODUCTION: string;

        constructor(options: HiPayOptions);

        requestTransactionV3Information(transactionReference: string): Promise<Transaction | null>;
        requestTransactionInformation(transactionReference: string): Promise<Transaction | null>;
        requestMaintenanceOperation(maintenanceRequest: Record<string, unknown>, transactionReference: string): Promise<Record<string, unknown>>;
        requestNewOrder(orderRequest: Record<string, unknown>, options?: {dataId?: string | null}): Promise<Record<string, unknown>>;
        requestHostedPaymentPage(pageRequest: Record<string, unknown>, options?: {legacy?: boolean; dataId?: string | null}): Promise<Record<string, unknown>>;
        requestOrderTransactionInformation(orderId: string): Promise<Transaction[]>;
        requestLookupToken(token: string, requestId?: string): Promise<Record<string, unknown>>;
    }

    export = HiPay;
}
