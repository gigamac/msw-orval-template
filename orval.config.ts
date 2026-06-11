// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
    petstore: {
        input: {
            // Fetch the schema directly from the live NestJS server
            target: 'http://localhost:3001/api-json',
        },
        output: {
            mode: 'split',
            target: './src/api/generated/api.ts',
            schemas: './src/api/generated/model',
            client: 'react-query',
            httpClient: 'axios',   // Force Orval to use Axios so it respects our global base URL
            mock: true,            // Generates the starter MSW handlers/models
        },
        hooks: {
            afterAllFilesWrite: 'npx prettier --write',
        },
    },
});