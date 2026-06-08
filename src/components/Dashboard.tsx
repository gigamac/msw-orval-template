import React, { useState } from 'react';
import {
    useGetPets,
    useGetOwners,
    useCreatePet,
    useCreateOwner,
    useAdoptPet
} from '../api/generated/api';
import ScenarioBar from './ScenarioBar';

export default function Dashboard() {
    // 1. Fetching current data state from MSW (backed by localStorage)
    const { data: petsResponse, refetch: refetchPets, isLoading: petsLoading } = useGetPets();
    const { data: ownersResponse, refetch: refetchOwners, isLoading: ownersLoading } = useGetOwners();

    const pets = petsResponse?.data;
    const owners = ownersResponse?.data;

    // 2. Initializing Orval/React-Query Mutations
    const createPetMutation = useCreatePet();
    const createOwnerMutation = useCreateOwner();
    const adoptPetMutation = useAdoptPet();

    // 3. Component Form States
    const [petName, setPetName] = useState('');
    const [petTag, setPetTag] = useState('Dog');
    const [ownerName, setOwnerName] = useState('');

    const [selectedOwnerId, setSelectedOwnerId] = useState('');
    const [selectedPetId, setSelectedPetId] = useState('');

    const [modalMessage, setModalMessage] = useState<string | null>(null);

    // --- SUBMIT HANDLERS ---

    const handleCreatePet = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!petName.trim()) return;

        // The id is omitted because our dbService auto-increments it
        await createPetMutation.mutateAsync({
            data: { name: petName, tag: petTag } as any
        });

        setPetName('');
        await refetchPets(); // Wait for the grid state to refresh
        setModalMessage(`Successfully added animal record: ${petName}`);
    };

    const handleCreateOwner = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ownerName.trim()) return;

        await createOwnerMutation.mutateAsync({
            data: { id: `owner-${Date.now()}`, name: ownerName }
        });

        setOwnerName('');
        await refetchOwners(); // Wait for the grid state to refresh
        setModalMessage(`Successfully added human record: ${ownerName}`);
    };

    const handleAdoption = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOwnerId || !selectedPetId) return;

        // Look up the names from our loaded data arrays before we reset the form state
        const selectedOwner = Array.isArray(owners) ? owners.find((o: any) => o.id === selectedOwnerId) : null;
        const selectedPet = Array.isArray(pets) ? pets.find((p: any) => p.id === Number(selectedPetId)) : null;
        const linkedOwnerName = selectedOwner ? selectedOwner.name : 'Unknown Owner';
        const linkedPetName = selectedPet ? selectedPet.name : 'Unknown Pet';

        await adoptPetMutation.mutateAsync({
            data: {
                ownerId: selectedOwnerId,
                petId: Number(selectedPetId)
            }
        });

        // Reset selection and pull pristine data reflecting the new foreign keys
        setSelectedOwnerId('');
        setSelectedPetId('');
        await Promise.all([refetchOwners(), refetchPets()]);
        setModalMessage(`Successfully linked owner ${linkedOwnerName} to pet ${linkedPetName}!`);
    };

    const handleHardReset = async () => {
        // Calling the break-glass utility injected into the window context in browser.ts
        if ((window as any).dbService) {
            (window as any).dbService.purgeAndReset();
            await Promise.all([refetchPets(), refetchOwners()]);
            alert('Database purged and reset to standard fallback seed data!');
        }
    };

    if (petsLoading || ownersLoading) return <div style={{ padding: '2rem' }}>Loading Mock Database...</div>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>

            {/* --- SUCCESS MODAL --- */}
            {modalMessage && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '400px' }}>
                        <h2 style={{ color: '#28a745', marginTop: 0 }}>Success!</h2>
                        <p style={{ margin: '1.5rem 0', fontSize: '1.1rem' }}>{modalMessage}</p>
                        <button onClick={() => setModalMessage(null)} style={{ padding: '0.5rem 1.5rem', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}>Close</button>
                    </div>
                </div>
            )}

            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Stateful Mock DB Management Panel</h1>
                <button onClick={handleHardReset} style={{ backgroundColor: '#dc3545', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Reset LocalStorage DB
                </button>
            </header>

            {/* --- SCENARIO BAR --- */}
            <ScenarioBar
                onActionComplete={setModalMessage}
                onRefetchData={async () => {
                    await Promise.all([refetchPets(), refetchOwners()]);
                }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>

                {/* --- LEFT COLUMN: DATA CREATION FORMS --- */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Add Pet */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
                        <h3>Create Animal Record</h3>
                        <form onSubmit={handleCreatePet} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" placeholder="Pet Name" value={petName} onChange={(e) => setPetName(e.target.value)} style={{ padding: '0.5rem', flex: 1 }} />
                            <select value={petTag} onChange={(e) => setPetTag(e.target.value)} style={{ padding: '0.5rem' }}>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                            </select>
                            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Add</button>
                        </form>
                    </div>

                    {/* Add Owner */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
                        <h3>Create Human Record</h3>
                        <form onSubmit={handleCreateOwner} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" placeholder="Owner Name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} style={{ padding: '0.5rem', flex: 1 }} />
                            <button type="submit" style={{ padding: '0.5rem 1rem' }}>Add</button>
                        </form>
                    </div>

                    {/* Relational Link Flow (Adoption) */}
                    <div style={{ border: '1px solid #007bff', padding: '1rem', borderRadius: '6px', backgroundColor: '#f8f9fa' }}>
                        <h3 style={{ color: '#007bff', marginTop: 0 }}>Execute State Linkage (Adoption)</h3>
                        <form onSubmit={handleAdoption} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Select Human:</label>
                                <select value={selectedOwnerId} onChange={(e) => setSelectedOwnerId(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} required>
                                    <option value="">-- Choose Owner --</option>
                                    {Array.isArray(owners) && owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Select Target Animal:</label>
                                <select value={selectedPetId} onChange={(e) => setSelectedPetId(e.target.value)} style={{ width: '100%', padding: '0.5rem' }} required>
                                    <option value="">-- Choose Pet --</option>
                                    {Array.isArray(pets) && pets.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
                                </select>
                            </div>

                            <button type="submit" style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '4px', cursor: 'pointer' }}>
                                Link Owner to Pet
                            </button>
                        </form>
                    </div>

                </section>

                {/* --- RIGHT COLUMN: ACTIVE DATABASE TABLES --- */}
                <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Pets Table */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
                        <h3 style={{ marginTop: 0 }}>Active Pets Table</h3>
                        <ul style={{ paddingLeft: '1.25rem' }}>
                            {Array.isArray(pets) && pets.map(pet => (
                                <li key={pet.id} style={{ marginBottom: '0.5rem' }}>
                                    <strong>ID: {pet.id}</strong> — {pet.name} <span style={{ fontSize: '0.85rem', color: '#666', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{pet.tag}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Owners Table */}
                    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '6px' }}>
                        <h3 style={{ marginTop: 0 }}>Active Owners Table (Showing Foreign Keys)</h3>
                        <ul style={{ paddingLeft: '1.25rem' }}>
                            {Array.isArray(owners) && owners.map((owner: any) => (
                                <li key={owner.id} style={{ marginBottom: '0.5rem' }}>
                                    <strong>{owner.name}</strong> (ID: {owner.id})
                                    <br />
                                    <span style={{ fontSize: '0.9rem', color: owner.petId ? '#28a745' : '#dc3545' }}>
                                        🔗 Linked Pet ID: {owner.petId ? owner.petId : 'None (Available to Adopt)'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </section>

            </div>
        </div>
    );
}