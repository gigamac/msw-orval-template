# MSW + Orval Stateful Mocking Template

This project is a boilerplate demonstrating how to integrate **React**, **Orval**, and **Mock Service Worker (MSW) v2** to create a highly robust, strongly-typed, and fully stateful frontend development environment.

By combining Orval's OpenAPI generation with a custom `localStorage` database, this template allows you to build and test complex, multi-step frontend flows without needing a live backend API.

## 🚀 Quick Start

1.  **Install dependencies:**
   ```bash
   npm install
   ```
2.  **Start the development server:**
   ```bash
   npm start
   ```
   Open http://localhost:3000 to view it in your browser.

---

## 🛠️ Orval: OpenAPI Code Generation

This project uses Orval to automatically generate a TypeScript client, React Query hooks, and base MSW mock data from an OpenAPI specification.

### Regenerating the Client

If the backend OpenAPI specification changes, you can regenerate your frontend client by running:
```bash
npm run orval-generate
```

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
*This command relies on an `orval.config.ts` (or similar) configuration to parse your schema and output the generated files into `src/api/generated/`.*

### `npm run build`
## 🌐 Mock Service Worker (MSW)

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
MSW intercepts fetch requests at the network level using a Service Worker. This means your browser's Network tab will show the requests as if they were hitting a real server, but they are actually handled entirely in the browser.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!
### MSW Initialization
The MSW worker is initialized in `src/index.tsx` before React boots up. This ensures that any queries fired immediately on mount are successfully intercepted.

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
If you ever need to regenerate the MSW service worker script, run:
```bash
npx msw init public/ --save
```

### `npm run eject`
## 💾 The Stateful Mock Engine

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**
While Orval is great at generating *random* mock data, real-world frontend testing often requires **state**. If you add an item to a list, you expect it to show up on the screen!

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.
To solve this, we've implemented a custom **Stateful Mock Engine** that lives in `src/mocks/`. It intercepts the Orval requests and backs them with a `localStorage` database. 

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.
It supports:
* Full CRUD operations with data persistence across page reloads.
* Relational data (e.g., linking a Pet to an Owner).
* A **Scenario Injection Engine** for instantly loading edge cases into the UI.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

Check the [Stateful Mock Setup readme](./src/mocks/MOCKS-README.md) for a simple howto.



## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
👉 **Read the Stateful Mock Engine Documentation**
