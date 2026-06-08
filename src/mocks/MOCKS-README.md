# 💾 Stateful Mock Engine

This directory contains the logic for our custom **Stateful Mock Engine**, which upgrades standard MSW network interception into a fully functional, in-browser database.

## Why Stateful Mocks?

Auto-generated API mocks return randomized data every time an endpoint is hit. While useful, random data cannot be used to test flows like "Create an Owner, Create a Pet, and then Link the two together." 

Our Stateful Mock Engine solves this by persisting data in the browser's `localStorage` (`MSW_DATABASE_V1`), allowing your frontend to behave exactly as it would with a real backend database.

---

## 🏗️ Architecture

The engine is broken down into three main layers to adhere to SOLID principles:

### 1. `db-service.ts` (The Database Layer)
A Singleton class (`MockDBService`) that handles reading, writing, and mutating data in `localStorage`. 
* It is completely isolated from HTTP logic.
* It ensures atomic transactions (fetching current data, updating it, and saving it back).
* It handles backend-like constraints (e.g., auto-incrementing IDs, foreign key references).

### 2. `handlers.ts` (The Network Layer)
The MSW route definitions. These intercept `http.get` and `http.post` requests from the frontend, parse the payloads, and call the appropriate methods on the `dbService`.
* Ensures the responses conform exactly to Orval's generated OpenAPI types (`<Pet>`, `<Owner>`, etc.).

### 3. `scenarios.ts` (The Data Definition Layer)
A centralized registry of predefined database states. This allows developers to instantly load or inject specific edge cases into the UI without manually filling out forms.

---

## 🎬 The Scenario Engine

Scenarios are predefined datasets that can be loaded into the mock database on demand. They are defined in `scenarios.ts`.

### Defining a Scenario
To add a new scenario, simply add an entry to the `SCENARIOS` object:

```typescript
'too-many-cats': {
    id: 'too-many-dogs',
    label: 'Dog Pound Guy',
    icon: '🐶',
    description: 'An owner with 10 dogs',
    getData: () => ({
        pets: [...Array(10).fill({ tag: 'Cat' })],
        owners: [{ id: 'dogsbody-lady', name: 'Dilbert' }]
    })
}
```
*The `<ScenarioBar />` UI component will automatically detect this new scenario and create buttons for it.*

### Load vs. Inject
* **Load (Replace):** Wipes the entire database clean and seeds it with ONLY the data from the chosen scenario. Perfect for isolated testing.
* **Inject (Append):** Keeps the existing database intact, but appends the scenario data on top of it. Useful for populating a large list quickly.

---

## 🐛 Debugging

Because the database runs in your browser, you can inspect and reset it easily:

**1. View the Raw Data:**
Open your browser's Developer Tools -> **Application** (or Storage) -> **Local Storage**. Look for the `MSW_DATABASE_V1` key.

**2. Use the Console API:**
The `dbService` is exposed to the global window object during development. You can interact with it directly in the browser console:

```javascript
// View current data
window.dbService.getData();

// Nuke the database and reset to random fakes
window.dbService.purgeAndReset();

// Inject a specific scenario manually
window.dbService.appendScenario('peter');
```