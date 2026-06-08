// src/mocks/db-service.ts
import { getGetPetsResponseMock } from '../api/generated/api.msw';
import type { Pet, Owner } from '../api/generated/model';

const STORAGE_KEY = 'MSW_DATABASE_V1';

// 1. Explicitly define what our entire database schema looks like
interface DatabaseSchema {
    pets: Pet[];
    owners: Owner[];
}

class MockDBService {
    constructor() {
        // Automatically runs the moment this service is imported
        this.initializeDatabase();
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
        const initialSeed: DatabaseSchema = {
            // Seed 5 realistic pets from your contract
            pets: Array.from({ length: 5 }, () => getGetPetsResponseMock()).flat(),
            owners: [
                { id: 'owner-1', name: 'Alice Smith', petId: undefined },
                { id: 'owner-2', name: 'Bob Jones', petId: undefined }
            ]
        };

        this.saveData(initialSeed);
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
    public purgeAndReset(): void {
        localStorage.removeItem(STORAGE_KEY);
        this.seedFallbackData();
    }
}

// Export as a single persistent instance (Singleton Pattern)
export const dbService = new MockDBService();