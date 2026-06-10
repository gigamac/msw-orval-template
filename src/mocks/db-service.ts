// src/mocks/db-service.ts
import type { Pet, Owner } from '../api/generated/model';
import { SCENARIOS } from './scenarios';

const STORAGE_KEY = 'MSW_DATABASE_V1';

// 1. Explicitly define what our entire database schema looks like
interface DatabaseSchema {
    pets: Pet[];
    owners: Owner[];
}

class MockDBService {
    constructor() {
        // Automatically runs the moment this service is imported, but only in development
        const isDevelopment = process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            this.initializeDatabase();
        }
    }

    /**
     * LIFECYCLE ENGINE:
     * Checks for existing state. If missing, runs the fallback seed mechanism.
     */
    private initializeDatabase(): void {
        try {
            const existingData = localStorage.getItem(STORAGE_KEY);

            if (!existingData) {
                console.log('📦 Mock DB: No existing state found. Seeding initial data...');
                this.seedFallbackData();
            }
        } catch (error) {
            console.error('❌ Mock DB failed to initialize from localStorage:', error);
        }
    }

    /**
     * FALLBACK SEED LAYER:
     * Leverages Orval's mock generators to establish a predictable, type-safe initial state.
     */
    private seedFallbackData(): void {
        this.loadScenario('random');
    }

    /**
     * SCENARIO ENGINE:
     * Wipes current state and loads specific predetermined scenarios for testing.
     */
    public loadScenario(scenarioId: string): void {
        const scenario = SCENARIOS[scenarioId] || SCENARIOS['random'];
        this.saveData(scenario.getData());
    }

    /**
     * SCENARIO ENGINE (ADDITIVE):
     * Keeps existing state and injects the scenario data on top of it.
     */
    public appendScenario(scenarioId: string): void {
        const currentData = this.getData();
        const scenario = SCENARIOS[scenarioId];

        if (!scenario) return;

        const newData = scenario.getData();
        currentData.pets.push(...newData.pets);
        currentData.owners.push(...newData.owners);

        this.saveData(currentData);
    }

    // --- CORE DATABASE UTILITIES (Atomic Transactions) ---

    private getData(): DatabaseSchema {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : { pets: [], owners: [] };
    }

    private saveData(data: DatabaseSchema): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    // --- PUBLIC API (Business Logic Services) ---

    public getAllPets(): Pet[] {
        return this.getData().pets;
    }

    public getPetById(id: number): Pet | undefined {
        return this.getData().pets.find(p => p.id === id);
    }

    public addPet(newPet: Omit<Pet, 'id'>): Pet {
        const database = this.getData();

        // Enforce backend-like rules (e.g., auto-incrementing IDs)
        const fullyFormedPet: Pet = {
            ...newPet,
            id: database.pets.length > 0 ? Math.max(...database.pets.map(p => p.id)) + 1 : 1
        };

        database.pets.push(fullyFormedPet);
        this.saveData(database);
        return fullyFormedPet;
    }

    public getAllOwners(): Owner[] {
        return this.getData().owners;
    }

    public addOwner(newOwner: Omit<Owner, 'id'>): Owner {
        const database = this.getData();

        const fullyFormedOwner: Owner = {
            ...newOwner,
            id: `owner-${database.owners.length + 1}`
        };

        database.owners.push(fullyFormedOwner);
        this.saveData(database);
        return fullyFormedOwner;
    }

    public linkPetToOwner(ownerId: string, petId: number): boolean {
        const database = this.getData();
        const owner = database.owners.find(o => o.id === ownerId);
        const petExists = database.pets.some(p => p.id === petId);

        if (owner && petExists) {
            // Stateful data retention logic: update the reference pointer
            owner.petId = petId;
            this.saveData(database);
            return true;
        }

        return false;
    }

    /**
     * SANITY UTILITY:
     * Allows manual triggers to completely purge testing states and re-seed clean configurations.
     */
    public purgeAndReset(scenarioId: string = 'random'): void {
        localStorage.removeItem(STORAGE_KEY);
        this.loadScenario(scenarioId);
    }
}

// Export as a single persistent instance (Singleton Pattern)
export const dbService = new MockDBService();