/**
 * Type definitions based on HiPay OpenAPI specifications
 * Source: https://github.com/hipay/openapi-hipay/tree/master/enterprise
 */

import type {components, operations} from './hipay-openapi';

// Extract commonly used types from the OpenAPI schema
export type MaintenanceRequest = components['schemas']['Maintenance'];
export type OperationResponse = components['schemas']['Operation'];
export type InputOrderRequest = components['schemas']['InputOrder'];
export type Transaction = components['schemas']['Transaction'];
export type CreateOrderResponse = operations['requestNewOrder']['responses']['200']['content']['application/json'];

// For V3 API (not in gateway.yaml, but used by SDK)
export interface TransactionV3 {
    [key: string]: unknown;
}

export interface PaymentCardToken {
    [key: string]: unknown;
}
export interface HostedPaymentPageRequest {
    [key: string]: unknown;
}

export interface HostedPaymentPageResponse {
    [key: string]: unknown;
}
