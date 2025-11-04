import {parseArgs} from '../src/index';

const OLD_ENV = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
    delete process.env.HIPAY_USERNAME;
    delete process.env.HIPAY_PASSWORD;
    delete process.env.HIPAY_ENVIRONMENT;
});

afterAll(() => {
    process.env = OLD_ENV;
});

describe('parseArgs', () => {
    test('throws when tools are missing', () => {
        process.env.HIPAY_USERNAME = 'user';
        process.env.HIPAY_PASSWORD = 'pass';
        expect(() => parseArgs([])).toThrow('The --tools arguments must be provided.');
    });

    test('throws on invalid tool name', () => {
        process.env.HIPAY_USERNAME = 'user';
        process.env.HIPAY_PASSWORD = 'pass';
        expect(() => parseArgs(['--tools=foo.bar'])).toThrow('Invalid tool: foo.bar');
    });

    test('accepts all tools value without validation', () => {
        process.env.HIPAY_USERNAME = 'user';
        process.env.HIPAY_PASSWORD = 'pass';
        const result = parseArgs(['--tools=all']);
        expect(result.tools).toEqual(['all']);
    });

    test('reads username/password from args', () => {
        const result = parseArgs(['--tools=transactions.get', '--username=user', '--password=pass']);
        expect(result.username).toBe('user');
        expect(result.password).toBe('pass');
        expect(result.environment).toBe('stage');
    });

    test('reads environment from args', () => {
        const result = parseArgs(['--tools=transactions.get', '--username=user', '--password=pass', '--environment=production']);
        expect(result.environment).toBe('production');
    });

    test('throws on invalid environment', () => {
        expect(() => parseArgs(['--tools=transactions.get', '--username=user', '--password=pass', '--environment=dev'])).toThrow('Invalid environment');
    });

    test('reads credentials from env when missing in args', () => {
        process.env.HIPAY_USERNAME = 'envUser';
        process.env.HIPAY_PASSWORD = 'envPass';
        const result = parseArgs(['--tools=transactions.get']);
        expect(result.username).toBe('envUser');
        expect(result.password).toBe('envPass');
    });

    test('throws when username missing from both args and env', () => {
        process.env.HIPAY_PASSWORD = 'envPass';
        expect(() => parseArgs(['--tools=transactions.get'])).toThrow('Username not provided');
    });

    test('throws when password missing from both args and env', () => {
        process.env.HIPAY_USERNAME = 'envUser';
        expect(() => parseArgs(['--tools=transactions.get'])).toThrow('Password not provided');
    });
});
