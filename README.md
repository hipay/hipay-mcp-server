# HiPay MCP Server

A Model Context Protocol (MCP) server for integrating with HiPay's payment processing API. This server provides tools to interact with HiPay's transaction management system through a standardized MCP interface.

## Features

- **Transaction Management**: Retrieve transaction details by ID
- **Environment Support**: Works with both staging and production environments
- **Secure Authentication**: Uses Basic Auth with username/password credentials
- **MCP Integration**: Fully compatible with the Model Context Protocol standard

## Installation

```bash
npm install @hipay/mcp-server
```

## Usage

### Command Line

```bash
# Using environment variables
export HIPAY_USERNAME="your_username"
export HIPAY_PASSWORD="your_password"
export HIPAY_ENVIRONMENT="environment"
npx @hipay/mcp-server --tools=transactions.get

# Using command line arguments
npx @hipay/mcp-server --tools=transactions.get --username=your_username --password=your_password --environment=stage
```

### Available Tools

- `transactions.get` - Retrieve transaction details by ID

### Environment Options

- `stage` - Use HiPay's staging environment (default)
- `production` - Use HiPay's production environment

## Configuration

### Environment Variables

- `HIPAY_USERNAME` - Your HiPay API username
- `HIPAY_PASSWORD` - Your HiPay API password
- `HIPAY_ENVIRONMENT` - Environment to use

### Command Line Arguments

- `--tools` - Comma-separated list of tools to enable (required)
- `--username` - HiPay API username (optional if `HIPAY_USERNAME` is set)
- `--password` - HiPay API password (optional if `HIPAY_PASSWORD` is set)
- `--environment` - Environment to use: `stage` or `production` (default: `stage`)

## API Reference

### getTransaction

Retrieves transaction details from HiPay's API.

**Parameters:**
- `transactionId` (string) - The ID of the transaction to retrieve

**Returns:**
- Transaction object with all available details

## Development

### Prerequisites

- Node.js 18+
- npm

## Support

For issues and questions, please open an issue in the repository.
