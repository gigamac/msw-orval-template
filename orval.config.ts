// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
    petstore: {
        input: {
            // Provide the path to your OpenAPI spec (local file, Swagger URL, or raw GitHub URL)
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