import {request} from 'gaxios';

class HiPay {
    private _username: string;
    private _password: string;
    private _apiUrl: string;

    constructor(username: string, password: string, environment: 'stage' | 'production') {
        this._username = username;
        this._password = password;

        this._apiUrl = environment === 'stage' ? 'https://stage-api-gateway.hipay.com' : 'https://api-gateway.hipay.com';
    }

    async getTransaction(transactionId: string): Promise<any> {
        const response = await request({
            url: `${this._apiUrl}/v3/transaction/${transactionId}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Basic ${Buffer.from(`${this._username}:${this._password}`).toString('base64')}`
            }
        });
        return response.data;
    }
}

export default HiPay;
