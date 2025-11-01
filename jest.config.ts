import type {Config} from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    testMatch: ['**/?(*.)+(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/**/index.d.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: []
};

export default config;
