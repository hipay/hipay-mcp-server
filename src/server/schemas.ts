/**
 * Zod schemas based on HiPay OpenAPI specifications
 * Source: https://github.com/hipay/openapi-hipay/tree/master/enterprise
 */

import {z} from 'zod';

// Maintenance Operation Schema
export const MaintenanceRequestSchema = z.object({
    operation: z.enum(['capture', 'refund', 'cancel', 'acceptChallenge', 'denyChallenge', 'finalize']).describe('The operation to perform on the transaction'),
    currency: z.string().optional().describe('Base currency for this order (ISO 4217)'),
    amount: z.string().optional().describe('Amount is required for partial maintenances. Do not specify amount for full captures or refunds'),
    operation_id: z.string().optional().describe('Operation merchant ID'),
    basket: z.string().optional().describe('Shopping cart details (JSON string)'),
    sub_transaction_reference: z.string().optional().describe('Number of the subtransaction to be refunded'),
    source: z.string().optional().describe('To identify the origin of the transaction')
});

// Input Order Schema - Simplified version (full schema is very complex)
export const InputOrderRequestSchema = z
    .object({
        payment_product: z.string().describe('The payment method used to proceed checkout'),
        orderid: z.string().describe('Unique order ID'),
        description: z.string().describe('The order short description'),
        currency: z.string().describe('Base currency for this order (ISO 4217)'),
        amount: z.number().describe('Total order amount'),
        cardtoken: z.string().describe('Card token'),
        email: z.string().email().optional().describe('Customer email address'),
        phone: z.string().optional().describe('Customer phone number'),
        firstname: z.string().optional().describe('Customer first name'),
        lastname: z.string().optional().describe('Customer last name'),
        accept_url: z.string().url().optional().describe('URL to return customer after successful payment'),
        decline_url: z.string().url().optional().describe('URL to return customer after declined payment'),
        pending_url: z.string().url().optional().describe('URL to return customer when payment is pending'),
        exception_url: z.string().url().optional().describe('URL to return customer after system failure'),
        cancel_url: z.string().url().optional().describe('URL to return customer after cancellation'),
        notify_url: z.string().url().optional().describe('Override notification URL'),
        basket: z.string().optional().describe('Shopping cart details (JSON string)'),
        custom_data: z.string().optional().describe('Custom data (JSON string)'),
        language: z.string().optional().describe('Locale code of customer'),
        operation: z.enum(['Sale', 'Authorization']).optional().describe('Transaction type'),
        eci: z.string().optional().describe('Electronic Commerce Indicator'),
        authentication_indicator: z.string().optional().describe('3-D Secure authentication indicator'),
        browser_info: z
            .object({
                java_enabled: z.boolean().optional(),
                javascript_enabled: z.boolean().optional(),
                ipaddr: z.string().optional(),
                http_accept: z.string().optional(),
                http_user_agent: z.string().optional(),
                language: z.string(),
                color_depth: z.enum(['1', '4', '8', '15', '16', '24', '32', '48']).optional(),
                screen_height: z.number().optional(),
                screen_width: z.number().optional(),
                timezone: z.string().optional(),
                device_fingerprint: z.string().optional()
            })
            .optional()
    })
    .passthrough(); // Allow additional fields

// Hosted Payment Page Request Schema - Similar to InputOrder but for hosted pages
export const HostedPaymentPageRequestSchema = z
    .object({
        payment_product: z.string().optional().describe('The payment method used to proceed checkout'),
        orderid: z.string().describe('Unique order ID'),
        description: z.string().describe('The order short description'),
        currency: z.string().describe('Base currency for this order (ISO 4217)'),
        amount: z.number().describe('Total order amount'),
        email: z.string().email().optional().describe('Customer email address'),
        phone: z.string().optional().describe('Customer phone number'),
        accept_url: z.string().url().optional().describe('URL to return customer after successful payment'),
        decline_url: z.string().url().optional().describe('URL to return customer after declined payment'),
        pending_url: z.string().url().optional().describe('URL to return customer when payment is pending'),
        exception_url: z.string().url().optional().describe('URL to return customer after system failure'),
        cancel_url: z.string().url().optional().describe('URL to return customer after cancellation'),
        notify_url: z.string().url().optional().describe('Override notification URL'),
        basket: z.string().optional().describe('Shopping cart details (JSON string)'),
        custom_data: z.string().optional().describe('Custom data (JSON string)'),
        language: z.string().optional().describe('Locale code of customer')
    })
    .passthrough(); // Allow additional fields
