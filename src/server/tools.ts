import {RequestHandlerExtra} from '@modelcontextprotocol/sdk/shared/protocol.js';
import {z} from 'zod';
import HiPay from '../sdk';
import type {MaintenanceRequest, HostedPaymentPageRequest} from '../types/hipay-types';
import {MaintenanceRequestSchema, HostedPaymentPageRequestSchema} from './schemas';
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp';

type ToolHandlerArgs = Record<string, unknown>;

// RequestHandlerExtra needs types with 'method' property, create minimal compatible types
type ToolHandlerExtra = RequestHandlerExtra<{method: string}, {method: string}>;

export interface ToolDefinition {
    name: string;
    description: string;
    schema: z.ZodObject<z.ZodRawShape>;
    handler: (hipay: HiPay, arg: ToolHandlerArgs) => Promise<unknown>;
    options: {
        destructiveHint: boolean;
        idempotentHint: boolean;
        openWorldHint: boolean;
        readOnlyHint: boolean;
        title: string;
    };
}

export const createTextResponse = (data: unknown): {content: Array<{type: 'text'; text: string}>} => ({
    content: [
        {
            type: 'text' as const,
            text: JSON.stringify(data, null, 2)
        }
    ]
});

export const TOOL_DEFINITIONS: ToolDefinition[] = [
    // Transactions
    {
        name: 'transactions.get',
        description: `
Get a transaction by ID (V3 API) using HiPay

Uses 1 parameter:
- transactionId (string, required): Transaction ID`,
        schema: z.object({
            transactionId: z.string().describe('The ID of the transaction to get')
        }),
        handler: async (hipay, arg) => hipay.getTransaction(String(arg.transactionId)),
        options: {
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
            readOnlyHint: true,
            title: 'Get transaction'
        }
    },
    {
        name: 'transactions.getV1',
        description: `
Get a transaction by ID (V1 API) using HiPay

Uses 1 parameter:
- transactionId (string, required): Transaction ID`,
        schema: z.object({
            transactionId: z.string().describe('The ID of the transaction to get')
        }),
        handler: async (hipay, arg) => hipay.getTransactionV1(String(arg.transactionId)),
        options: {
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
            readOnlyHint: true,
            title: 'Get transaction (V1)'
        }
    },
    {
        name: 'transactions.getByOrder',
        description: `
Get all transactions for an order using HiPay

Uses 1 parameter:
- orderId (string, required): Order ID`,
        schema: z.object({
            orderId: z.string().describe('The order ID to get transactions for')
        }),
        handler: async (hipay, arg) => hipay.getTransactionsByOrder(String(arg.orderId)),
        options: {
            destructiveHint: false,
            idempotentHint: true,
            openWorldHint: true,
            readOnlyHint: true,
            title: 'Get transactions by order'
        }
    },
    {
        name: 'transactions.update',
        description: `
Update a transaction (capture, refund, accept, etc.) using HiPay

Uses 2 parameters:
- transactionReference (string, required): Transaction reference
- maintenanceRequest (object, required): Maintenance request object with fields:
  - operation (enum, required): Operation type (capture, refund, cancel, acceptChallenge, denyChallenge, finalize)
  - currency (string, optional): Base currency (ISO 4217)
  - amount (string, optional): Amount for partial operations
  - operation_id (string, optional): Operation merchant ID
  - basket (string, optional): Shopping cart details (JSON string)
  - sub_transaction_reference (string, optional): Subtransaction reference for refunds
  - source (string, optional): Transaction origin identifier`,
        schema: z.object({
            transactionReference: z.string().describe('The transaction reference to update'),
            maintenanceRequest: MaintenanceRequestSchema.describe('The maintenance request object (operation, amount, etc.)')
        }),
        handler: async (hipay, arg) => hipay.updateTransaction(arg.maintenanceRequest as MaintenanceRequest, String(arg.transactionReference)),
        options: {
            destructiveHint: true,
            idempotentHint: false,
            openWorldHint: true,
            readOnlyHint: false,
            title: 'Update transaction'
        }
    },
    {
        name: 'hostedPaymentPages.create',
        description: `Create a hosted payment page using HiPay

Uses 3 parameters:
- pageRequest (object, required): Hosted payment page request object with fields:
  - orderid (string, required): Unique order ID
  - description (string, required): Order short description
  - currency (string, required): Base currency (ISO 4217)
  - amount (number, required): Total order amount
  - payment_product (string, optional): Payment method for checkout
  - email (string, optional): Customer email address
  - phone (string, optional): Customer phone number
  - accept_url (string, optional): URL after successful payment
  - decline_url (string, optional): URL after declined payment
  - pending_url (string, optional): URL when payment is pending
  - exception_url (string, optional): URL after system failure
  - cancel_url (string, optional): URL after cancellation
  - notify_url (string, optional): Override notification URL
  - basket (string, optional): Shopping cart details (JSON string)
  - custom_data (string, optional): Custom data (JSON string)
  - language (string, optional): Locale code of customer
- legacy (boolean, optional): Use legacy payment page
- dataId (string, optional): Custom dataId for Data API`,
        schema: z.object({
            pageRequest: HostedPaymentPageRequestSchema.describe('The hosted payment page request object'),
            legacy: z.boolean().optional().describe('Use legacy payment page'),
            dataId: z.string().optional().describe('Custom dataId to use in call to Data API')
        }),
        handler: async (hipay, arg) =>
            hipay.createHostedPaymentPage(arg.pageRequest as HostedPaymentPageRequest, {
                legacy: Boolean(arg.legacy),
                dataId: typeof arg.dataId === 'string' ? arg.dataId : null
            }),
        options: {
            destructiveHint: false,
            idempotentHint: false,
            openWorldHint: true,
            readOnlyHint: false,
            title: 'Create hosted payment page'
        }
    }
];

export function registerTool(server: McpServer, definition: ToolDefinition, hipay: HiPay): void {
    server.tool(
        definition.name,
        definition.description,
        definition.schema.shape,
        definition.options,
        async (arg: ToolHandlerArgs, _extra: ToolHandlerExtra) => {
            try {
                const result = await definition.handler(hipay, arg);
                return createTextResponse(result);
            } catch (error: unknown) {
                let message: string;
                let name: string;
                if (error instanceof Error) {
                    message = error.message || 'Unknown error';
                    name = error.name || 'Error';
                } else if (typeof error === 'string') {
                    message = error || 'Unknown error';
                    name = 'Error';
                } else {
                    message = 'Unknown error';
                    name = 'Error';
                }
                return createTextResponse({error: message, name});
            }
        }
    );
}
