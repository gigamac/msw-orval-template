// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
    petstore: {
        input: {
            // 1. Direct Orval to look at the raw online GitHub file
            target: './openapi.yaml',
        },
        output: {
            mode: 'split',
            target: './src/api/generated/api.ts',
            schemas: './src/api/generated/model',
            client: 'react-query', // Or axios, fetch, swr, etc.
            mock: true,            // Generates the starter MSW handlers/models
        },
        hooks: {
            afterAllFilesWrite: 'npx prettier --write',
        },
    },
});