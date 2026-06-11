import React, { useState } from 'react';
import { useGetPets, useCreatePet, useGetOwners, useCreateOwner, useAdoptPet } from '../api/generated/api';
import { Pet, Owner } from '../api/generated/model';

const Dashboard = () => {
    // Fetch Queries
    const { data: petsResponse, refetch: refetchPets } = useGetPets();
    const { data: ownersResponse, refetch: refetchOwners } = useGetOwners();

    const pets = petsResponse?.data || [];
    const owners = ownersResponse?.data || [];

    // Local UI State for Forms
    const [ownerName, setOwnerName] = useState('');
    const [petName, setPetName] = useState('');
    const [petTag, setPetTag] = useState('');
    const [selectedOwner, setSelectedOwner] = useState<string>('');
    const [selectedPet, setSelectedPet] = useState<string>('');

    const [modalMsg, setModalMsg] = useState('');

    // Mutations
    const createPetMutation = useCreatePet({
        mutation: {
            onSuccess: (_, variables) => {
                refetchPets();
                setModalMsg(`Successfully added animal record: ${variables.data.name}`);
                setPetName('');
                setPetTag('');
            }
        }
    });

    const createOwnerMutation = useCreateOwner({
        mutation: {
            onSuccess: (_, variables) => {
                refetchOwners();
                setModalMsg(`Successfully added human record: ${variables.data.name}`);
                setOwnerName('');
            }
        }
    });

    const adoptPetMutation = useAdoptPet({
        mutation: {
            onSuccess: () => {
                // Refetch both lists to see the updated relational linkage
                refetchPets();
                refetchOwners();
                const owner = owners.find(o => o.id === selectedOwner);
                const pet = pets.find(p => p.id === Number(selectedPet));
                setModalMsg(`Successfully linked owner ${owner?.name} to pet ${pet?.name}!`);
                setSelectedOwner('');
                setSelectedPet('');
            }
        }
    });

    // Action Handlers
    const handleAddPet = () => {
        if (!petName) return;
        const newPet: Pet = {
            id: Date.now(),
            name: petName,
            tag: petTag || undefined,
        };
        createPetMutation.mutate({ data: newPet });
    };

    const handleAddOwner = () => {
        if (!ownerName) return;
        const newOwner: Owner = {
            id: `owner-${Date.now()}`,
            name: ownerName,
        };
        createOwnerMutation.mutate({ data: newOwner });
    };

    const handleAdopt = () => {
        if (!selectedOwner || !selectedPet) return;
        adoptPetMutation.mutate({
            data: {
                ownerId: selectedOwner,
                petId: Number(selectedPet),
            }
        });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
            <h1>Pet & Owner Dashboard</h1>

            {/* Success Modal */}
            {modalMsg && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
                        <h2>Success!</h2>
                        <p>{modalMsg}</p>
                        <button onClick={() => setModalMsg('')}>Close</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <h3>Create Human Record</h3>
                    <input
                        placeholder="Owner Name"
                        value={ownerName}
                        onChange={e => setOwnerName(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <button onClick={handleAddOwner} disabled={createOwnerMutation.isPending || !ownerName}>
                        {createOwnerMutation.isPending ? 'Adding...' : 'Add'}
                    </button>
                </div>

                <div style={{ flex: 1, padding: '15px', border: '1px solid #ccc', borderRadius: '4px' }}>
                    <h3>Create Animal Record</h3>
                    <input
                        placeholder="Pet Name"
                        value={petName}
                        onChange={e => setPetName(e.target.value)}
                        style={{ marginRight: '10px', padding: '5px', width: '120px' }}
                    />
                    <select value={petTag} onChange={e => setPetTag(e.target.value)} style={{ marginRight: '10px', padding: '5px' }}>
                        <option value="">Select Tag</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                    </select>
                    <button onClick={handleAddPet} disabled={createPetMutation.isPending || !petName}>
                        {createPetMutation.isPending ? 'Adding...' : 'Add'}
                    </button>
                </div>
            </div>

            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '4px', background: '#f9f9f9', marginBottom: '20px' }}>
                <h3>Execute State Linkage (Adoption)</h3>
                <select value={selectedOwner} onChange={(e) => setSelectedOwner(e.target.value)} style={{ marginRight: '10px', padding: '5px' }}>
                    <option value="">-- Select Human --</option>
                    {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                <select value={selectedPet} onChange={(e) => setSelectedPet(e.target.value)} style={{ marginRight: '10px', padding: '5px' }}>
                    <option value="">-- Select Target Animal --</option>
                    {pets.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
                </select>
                <button onClick={handleAdopt} disabled={!selectedOwner || !selectedPet || adoptPetMutation.isPending} style={{ padding: '6px 12px' }}>
                    {adoptPetMutation.isPending ? 'Adopting...' : 'Link Owner to Pet'}
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h3>Active Owners</h3>
                    <ul>
                        {owners.map((owner) => (
                            <li key={owner.id}>
                                <strong>{owner.name}</strong> <br />
                                <small>Linked Pet ID: {owner.petId || 'None'}</small>
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Active Pets</h3>
                    <ul>
                        {pets.map((pet) => (
                            <li key={pet.id}>
                                {pet.name} (ID: {pet.id}) {pet.tag && `- ${pet.tag}`}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;