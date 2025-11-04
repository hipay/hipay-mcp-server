import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import HiPay from '../sdk';
import {TOOL_DEFINITIONS, registerTool} from './tools';
import packageJson from '../../package.json';

class HiPayMCPServer extends McpServer {
    private _hipay: HiPay;

    constructor({
        username,
        password,
        environment,
        enabledTools = []
    }: {
        username: string;
        password: string;
        environment: 'stage' | 'production';
        enabledTools?: string[];
    }) {
        super({
            name: 'HiPay',
            version: (packageJson as {version: string}).version
        });

        this._hipay = new HiPay(username, password, environment);

        const shouldRegisterAll = enabledTools.includes('all') || enabledTools.length === 0;
        const toolsToRegister = shouldRegisterAll ? TOOL_DEFINITIONS : TOOL_DEFINITIONS.filter((tool) => enabledTools.includes(tool.name));

        for (const definition of toolsToRegister) {
            registerTool(this, definition, this._hipay);
        }
    }
}

export default HiPayMCPServer;
