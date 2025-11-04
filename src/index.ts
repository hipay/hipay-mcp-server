#!/usr/bin/env node

import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {green, red, yellow} from 'colors';
import HiPayMCPServer from './server';
import {TOOL_DEFINITIONS} from './server/tools';

type Options = {
    tools?: string[];
    username?: string;
    password?: string;
    environment?: 'stage' | 'production';
};

const ACCEPTED_ARGS = ['api-key', 'username', 'password'];
const ACCEPTED_TOOLS = ['all', ...TOOL_DEFINITIONS.map((t) => t.name)];

export function parseArgs(args: string[]): Options {
    const options: Options = {};

    args.forEach((arg) => {
        if (arg.startsWith('--')) {
            const [key, value] = arg.slice(2).split('=');

            if (key == 'tools') {
                options.tools = value.split(',');
            } else if (key == 'username') {
                options.username = value;
            } else if (key == 'password') {
                options.password = value;
            } else if (key == 'environment') {
                options.environment = value as 'stage' | 'production';
            } else {
                throw new Error(`Invalid argument: ${key}. Accepted arguments are: ${ACCEPTED_ARGS.join(', ')}`);
            }
        }
    });

    // Check if required tools arguments is present
    if (!options.tools) {
        throw new Error('The --tools arguments must be provided.');
    }

    // Validate tools against accepted enum values
    options.tools.forEach((tool: string) => {
        if (tool == 'all') {
            return;
        }
        if (!ACCEPTED_TOOLS.includes(tool.trim())) {
            throw new Error(`Invalid tool: ${tool}. Accepted tools are: ${ACCEPTED_TOOLS.join(', ')}`);
        }
    });

    const username = options.username || process.env.HIPAY_USERNAME;
    if (!username) {
        throw new Error('Username not provided. Please either pass it as an argument --username=$USERNAME or set the HIPAY_USERNAME environment variable.');
    }

    const password = options.password || process.env.HIPAY_PASSWORD;
    if (!password) {
        throw new Error('Password not provided. Please either pass it as an argument --password=$PASSWORD or set the HIPAY_PASSWORD environment variable.');
    }

    const environment = options.environment || process.env.HIPAY_ENVIRONMENT || 'stage';
    if (environment !== 'stage' && environment !== 'production') {
        throw new Error('Invalid environment. Please either pass it as an argument --environment=stage or --environment=production.');
    }

    options.username = username;
    options.password = password;
    options.environment = environment;

    return options;
}

function handleError(error: unknown) {
    console.error(red('\n🚨  Error initializing HiPay MCP server:\n'));
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(yellow(`   ${errorMessage}\n`));
}

export async function main() {
    const options = parseArgs(process.argv.slice(2));

    const server = new HiPayMCPServer({
        username: options.username!,
        password: options.password!,
        environment: options.environment!,
        enabledTools: options.tools || []
    });

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error(green('✅ HiPay MCP Server running on stdio'));
}

if (require.main === module) {
    main().catch((error) => {
        handleError(error);
    });
}
