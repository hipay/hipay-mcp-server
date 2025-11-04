import HiPaySDK from '@hipay/hipay-enterprise-sdk-nodejs';
import type {
    TransactionV3,
    Transaction,
    MaintenanceRequest,
    OperationResponse,
    HostedPaymentPageRequest,
    HostedPaymentPageResponse
} from '../types/hipay-types';
import packageJson from '../../package.json';

class HiPay {
    private _client: HiPaySDK;

    constructor(username: string, password: string, environment: 'stage' | 'production') {
        this._client = new HiPaySDK({
            apiUsername: username,
            apiPassword: password,
            apiEnv: environment === 'stage' ? HiPaySDK.API_ENV_STAGE : HiPaySDK.API_ENV_PRODUCTION,
            httpUserAgent: `HiPayMCPServer/${(packageJson as {version: string}).version}`
        });
    }

    async getTransaction(transactionId: string): Promise<TransactionV3 | null> {
        const result = await this._client.requestTransactionV3Information(transactionId);
        return result as TransactionV3 | null;
    }

    async getTransactionV1(transactionId: string): Promise<Transaction | null> {
        const result = await this._client.requestTransactionInformation(transactionId);
        return result as Transaction | null;
    }

    async getTransactionsByOrder(orderId: string): Promise<Transaction[]> {
        const result = await this._client.requestOrderTransactionInformation(orderId);
        return result as Transaction[];
    }

    async updateTransaction(maintenanceRequest: MaintenanceRequest, transactionReference: string): Promise<OperationResponse> {
        const result = await this._client.requestMaintenanceOperation(maintenanceRequest, transactionReference);
        return result as OperationResponse;
    }

    async createHostedPaymentPage(
        pageRequest: HostedPaymentPageRequest,
        options?: {legacy?: boolean; dataId?: string | null}
    ): Promise<HostedPaymentPageResponse> {
        const result = await this._client.requestHostedPaymentPage(pageRequest, options);
        return result as HostedPaymentPageResponse;
    }
}

export default HiPay;
