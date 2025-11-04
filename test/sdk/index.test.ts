import HiPay from '../../src/sdk';

const mockRequestTransactionV3Information = jest.fn();
const mockRequestTransactionInformation = jest.fn();
const mockRequestOrderTransactionInformation = jest.fn();
const mockRequestNewOrder = jest.fn();
const mockRequestMaintenanceOperation = jest.fn();
const mockRequestHostedPaymentPage = jest.fn();

jest.mock('@hipay/hipay-enterprise-sdk-nodejs', () => {
    return jest.fn().mockImplementation(() => {
        return {
            requestTransactionV3Information: mockRequestTransactionV3Information,
            requestTransactionInformation: mockRequestTransactionInformation,
            requestOrderTransactionInformation: mockRequestOrderTransactionInformation,
            requestNewOrder: mockRequestNewOrder,
            requestMaintenanceOperation: mockRequestMaintenanceOperation,
            requestHostedPaymentPage: mockRequestHostedPaymentPage
        };
    });
});

const HiPaySDK = require('@hipay/hipay-enterprise-sdk-nodejs');
HiPaySDK.API_ENV_STAGE = 'stage';
HiPaySDK.API_ENV_PRODUCTION = 'production';

describe('HiPay SDK', () => {
    let sdk: HiPay;

    beforeEach(() => {
        jest.clearAllMocks();
        mockRequestTransactionV3Information.mockClear();
        mockRequestTransactionInformation.mockClear();
        mockRequestOrderTransactionInformation.mockClear();
        mockRequestNewOrder.mockClear();
        mockRequestMaintenanceOperation.mockClear();
        mockRequestHostedPaymentPage.mockClear();

        sdk = new HiPay('user', 'pass', 'stage');
    });

    describe('constructor', () => {
        test('uses correct environment when initializing SDK', () => {
            new HiPay('u', 'p', 'production');

            expect(HiPaySDK).toHaveBeenCalled();
            const lastCall = (HiPaySDK as jest.Mock).mock.calls[(HiPaySDK as jest.Mock).mock.calls.length - 1][0];
            expect(lastCall.apiEnv).toBe('production');
            expect(lastCall.apiUsername).toBe('u');
            expect(lastCall.apiPassword).toBe('p');
        });

        test('uses stage environment', () => {
            new HiPay('u', 'p', 'stage');

            const lastCall = (HiPaySDK as jest.Mock).mock.calls[(HiPaySDK as jest.Mock).mock.calls.length - 1][0];
            expect(lastCall.apiEnv).toBe('stage');
        });
    });

    describe('getTransaction', () => {
        test('calls requestTransactionV3Information with correct transaction ID', async () => {
            const txId = 'abc123';
            const mockTransaction = {id: txId, amount: 100};
            mockRequestTransactionV3Information.mockResolvedValue(mockTransaction);

            const result = await sdk.getTransaction(txId);

            expect(mockRequestTransactionV3Information).toHaveBeenCalledTimes(1);
            expect(mockRequestTransactionV3Information).toHaveBeenCalledWith(txId);
            expect(result).toEqual(mockTransaction);
        });

        test('returns null when transaction not found', async () => {
            mockRequestTransactionV3Information.mockResolvedValue(null);

            const result = await sdk.getTransaction('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('getTransactionV1', () => {
        test('calls requestTransactionInformation with correct transaction ID', async () => {
            const txId = 'tx123';
            const mockTransaction = {id: txId, state: 'completed'};
            mockRequestTransactionInformation.mockResolvedValue(mockTransaction);

            const result = await sdk.getTransactionV1(txId);

            expect(mockRequestTransactionInformation).toHaveBeenCalledTimes(1);
            expect(mockRequestTransactionInformation).toHaveBeenCalledWith(txId);
            expect(result).toEqual(mockTransaction);
        });

        test('returns null when transaction not found', async () => {
            mockRequestTransactionInformation.mockResolvedValue(null);

            const result = await sdk.getTransactionV1('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('getTransactionsByOrder', () => {
        test('calls requestOrderTransactionInformation with correct order ID', async () => {
            const orderId = 'order123';
            const mockTransactions = [
                {id: 'tx1', orderId},
                {id: 'tx2', orderId}
            ];
            mockRequestOrderTransactionInformation.mockResolvedValue(mockTransactions);

            const result = await sdk.getTransactionsByOrder(orderId);

            expect(mockRequestOrderTransactionInformation).toHaveBeenCalledTimes(1);
            expect(mockRequestOrderTransactionInformation).toHaveBeenCalledWith(orderId);
            expect(result).toEqual(mockTransactions);
        });

        test('returns empty array when no transactions found', async () => {
            mockRequestOrderTransactionInformation.mockResolvedValue([]);

            const result = await sdk.getTransactionsByOrder('empty');

            expect(result).toEqual([]);
        });
    });

    describe('updateTransaction', () => {
        test('calls requestMaintenanceOperation with maintenance request and transaction reference', async () => {
            const maintenanceRequest = {operation: 'capture' as const, amount: '50.00'};
            const transactionRef = 'tx_ref_123';
            const mockResponse = {id: transactionRef, status: 'captured'};
            mockRequestMaintenanceOperation.mockResolvedValue(mockResponse);

            const result = await sdk.updateTransaction(maintenanceRequest, transactionRef);

            expect(mockRequestMaintenanceOperation).toHaveBeenCalledTimes(1);
            expect(mockRequestMaintenanceOperation).toHaveBeenCalledWith(maintenanceRequest, transactionRef);
            expect(result).toEqual(mockResponse);
        });
    });

    describe('createHostedPaymentPage', () => {
        test('calls requestHostedPaymentPage with page request and options', async () => {
            const pageRequest = {orderid: 'order1', amount: 100, currency: 'EUR'};
            const options = {legacy: true, dataId: 'data123'};
            const mockResponse = {redirectUrl: 'https://example.com/pay'};
            mockRequestHostedPaymentPage.mockResolvedValue(mockResponse);

            const result = await sdk.createHostedPaymentPage(pageRequest, options);

            expect(mockRequestHostedPaymentPage).toHaveBeenCalledTimes(1);
            expect(mockRequestHostedPaymentPage).toHaveBeenCalledWith(pageRequest, options);
            expect(result).toEqual(mockResponse);
        });

        test('calls requestHostedPaymentPage without options', async () => {
            const pageRequest = {orderid: 'order1', amount: 100, currency: 'EUR'};
            const mockResponse = {redirectUrl: 'https://example.com/pay'};
            mockRequestHostedPaymentPage.mockResolvedValue(mockResponse);

            await sdk.createHostedPaymentPage(pageRequest);

            expect(mockRequestHostedPaymentPage).toHaveBeenCalledWith(pageRequest, undefined);
        });
    });
});
