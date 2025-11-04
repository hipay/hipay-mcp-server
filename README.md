# HiPay MCP Server

A Model Context Protocol (MCP) server for integrating with HiPay's Enterprise payment processing API. This server provides comprehensive tools to interact with HiPay's transaction management, payment processing, and security features through a standardized MCP interface.

## Features

- **Transaction Management**: Retrieve, create, and update transactions using V1 and V3 APIs
- **Payment Processing**: Create orders and hosted payment pages
- **Order Management**: Get all transactions associated with an order
- **Environment Support**: Works with both staging and production environments
- **Secure Authentication**: Uses Basic Auth with username/password credentials
- **MCP Integration**: Fully compatible with the Model Context Protocol standard

## Usage

### Command Line

```bash
# Using environment variables
export HIPAY_USERNAME="your_username"
export HIPAY_PASSWORD="your_password"
export HIPAY_ENVIRONMENT="stage"
npx @hipay/mcp-server --tools=transactions.get,transactions.update

# Using command line arguments
npx @hipay/mcp-server \
  --tools=all \
  --username=your_username \
  --password=your_password \
  --environment=production

# Enable specific tools
npx @hipay/mcp-server \
  --tools=transactions.get,transactions.update \
  --username=your_username \
  --password=your_password
```

### Available Tools

#### Transaction Tools

- **`transactions.get`** - Retrieve transaction details by ID (V3 API)
- **`transactions.getV1`** - Retrieve transaction details by ID (V1 API)

- **`transactions.getByOrder`** - Get all transactions for an order

- **`transactions.update`** - Update a transaction (capture, refund, accept, etc.)

#### Hosted Payment Pages

- **`hostedPaymentPages.create`** - Create a hosted payment page

### Tool Selection

You can enable specific tools or all tools:

- `--tools=all` - Enable all available tools
- `--tools=transactions.get,transactions.update` - Enable specific tools (comma-separated)
- `--tools=` - If omitted, all tools are enabled by default

### Environment Options

- `stage` - Use HiPay's staging environment (default)
- `production` - Use HiPay's production environment

## Configuration

### Environment Variables

- `HIPAY_USERNAME` - Your HiPay API username (required)
- `HIPAY_PASSWORD` - Your HiPay API password (required)
- `HIPAY_ENVIRONMENT` - Environment to use: `stage` or `production` (default: `stage`)

### Command Line Arguments

- `--tools` - Comma-separated list of tools to enable, or `all` for all tools (required)
- `--username` - HiPay API username (optional if `HIPAY_USERNAME` is set)
- `--password` - HiPay API password (optional if `HIPAY_PASSWORD` is set)
- `--environment` - Environment to use: `stage` or `production` (default: `stage`)

### Prerequisites

- Node.js 18+
- npm

## Support

For issues and questions, please open an issue in the repository.
