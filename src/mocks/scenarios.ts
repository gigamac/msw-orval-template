// src/mocks/scenarios.ts
import { getGetPetsResponseMock } from '../api/generated/api.msw';
import type { Pet, Owner } from '../api/generated/model';

export interface ScenarioData {
    pets: Pet[];
    owners: Owner[];
}

export interface ScenarioConfig {
    id: string;
    label: string;
    icon: string;
    description: string;
    getData: () => ScenarioData;
}

// The SOLID Scenario Registry
export const SCENARIOS: Record<string, ScenarioConfig> = {
    'random': {
        id: 'random',
        label: 'Random Fakes',
        icon: '🎲',
        description: 'Loads a random set of mocked data',
        getData: () => ({
            pets: Array.from({ length: 5 }, () => getGetPetsResponseMock()).flat() as Pet[],
            owners: [
                { id: 'owner-1', name: 'Alice Smith', petId: undefined } as unknown as Owner,
                { id: 'owner-2', name: 'Bob Jones', petId: undefined } as unknown as Owner
            ]
        })
    },
    'peter': {
        id: 'peter',
        label: 'Owner: Peter',
        icon: '👤',
        description: 'Just Peter, no pets',
        getData: () => ({
            pets: [],
            owners: [{ id: `owner-peter-${Date.now()}`, name: 'Peter', petId: undefined } as unknown as Owner]
        })
    },
    'sylvester': {
        id: 'sylvester',
        label: 'Pet: Sylvester (Cat)',
        icon: '🐾',
        description: 'Just Sylvester',
        getData: () => ({
            pets: [{ id: Date.now(), name: 'Sylvester', tag: 'Cat' } as unknown as Pet],
            owners: []
        })
    },
    'bart-and-santas-helper': {
        id: 'bart-and-santas-helper',
        label: "Bart & Santa's Helper",
        icon: '🔗',
        description: 'A boy and his dog',
        getData: () => {
            const petId = Date.now();
            return {
                pets: [{ id: petId, name: "Santa's Helper", tag: 'Dog' } as unknown as Pet],
                owners: [{ id: `owner-bart-${Date.now()}`, name: 'Bart', petId } as unknown as Owner]
            };
        }
    }
};

export const SCENARIO_LIST = Object.values(SCENARIOS);