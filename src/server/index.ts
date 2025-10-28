import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {RequestHandlerExtra} from '@modelcontextprotocol/sdk/shared/protocol.js';
import HiPay from '../sdk';
import {z} from 'zod';

class HiPayMCPServer extends McpServer {
    private _hipay: HiPay;

    constructor({username, password, environment}: {username: string; password: string; environment: 'stage' | 'production'}) {
        super({
            name: 'HiPay',
            version: '0.1.0'
        });

        this._hipay = new HiPay(username, password, environment);

        this.tool(
            'transactions.get',
            'Get a transaction',
            z.object({
                transactionId: z.string().describe('The ID of the transaction to get')
            }).shape,
            {
                destructiveHint: false,
                idempotentHint: false,
                openWorldHint: true,
                readOnlyHint: false,
                title: 'Get transaction'
            },
            async (arg: any, _extra: RequestHandlerExtra<any, any>) => {
                const result = await this._hipay.getTransaction(arg.transactionId);
                return {
                    content: [
                        {
                            type: 'text' as const,
                            text: JSON.stringify(result, null, 2)
                        }
                    ]
                };
            }
        );
    }
}

export default HiPayMCPServer;
