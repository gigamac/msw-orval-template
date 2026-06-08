// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { dbService } from './db-service';
import type { Pet, Owner, AdoptPetBody } from '../api/generated/model';

export const handlers = [
    // 1. GET ALL PETS
    http.get('/pets', () => {
        const pets = dbService.getAllPets();
        return HttpResponse.json<Pet[]>(pets);
    }),

    // 2. CREATE A NEW PET
    http.post('/pets', async ({ request }: { request: Request }) => {
        const body = await request.json() as Pet;

        // Quick validation simulation
        if (!body?.name) {
            return new HttpResponse("Name is required", { status: 400 });
        }

        const createdPet = dbService.addPet(body);
        return HttpResponse.json<Pet>(createdPet, { status: 201 });
    }),

    // 3. ADOPT / LINK PET TO OWNER
    http.post('/adopt', async ({ request }: { request: Request }) => {
        const { ownerId, petId } = await request.json() as AdoptPetBody;

        const success = dbService.linkPetToOwner(ownerId, Number(petId));

        if (!success) {
            return new HttpResponse("Relationship link failed. Verify Owner and Pet IDs.", { status: 404 });
        }

        return HttpResponse.json({ message: "Successfully adopted!" }, { status: 200 });
    }),

    // 4. GET ALL OWNERS
    http.get('/owners', () => {
        const owners = dbService.getAllOwners();
        return HttpResponse.json<Owner[]>(owners);
    }),

    // 5. CREATE A NEW OWNER
    http.post('/owners', async ({ request }: { request: Request }) => {
        const body = await request.json() as Owner;

        if (!body?.name) {
            return new HttpResponse("Name is required", { status: 400 });
        }

        const createdOwner = dbService.addOwner(body);
        return HttpResponse.json<Owner>(createdOwner, { status: 201 });
    })
];