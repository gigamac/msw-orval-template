import React, { useState } from 'react';
import { SCENARIO_LIST } from '../mocks/scenarios';
import { dbService } from '../mocks/db-service';

export const ScenarioBar = () => {
    const isLiveServer = localStorage.getItem('USE_LIVE_SERVER') === 'true';
    const [modalMsg, setModalMsg] = useState('');

    const toggleBackend = () => {
        localStorage.setItem('USE_LIVE_SERVER', (!isLiveServer).toString());
        window.location.reload(); // Reloads React to instantly re-route Axios/MSW
    };

    const handleLoad = (id: string, label: string) => {
        dbService.loadScenario(id);
        setModalMsg(`Loaded Scenario: ${label}`);
    };

    const handleAppend = (id: string, label: string) => {
        dbService.appendScenario(id);
        setModalMsg(`Injected Scenario: ${label}`);
    };

    return (
        <div style={{
            background: isLiveServer ? '#e6f4ea' : '#ffebe6',
            border: `1px solid ${isLiveServer ? '#ceead6' : '#ffc5b8'}`,
            padding: '15px', marginBottom: '20px', borderRadius: '4px',
            fontFamily: 'sans-serif'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem' }}>Stateful Mock DB Management Panel</h2>
                <button onClick={toggleBackend} style={{ padding: '6px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}>
                    Switch to {isLiveServer ? 'MSW Mocks' : 'Live Server'}
                </button>
            </div>

            {modalMsg && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{ background: 'white', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
                        <h2>Success!</h2>
                        <p>{modalMsg}</p>
                        <button onClick={() => { setModalMsg(''); window.location.reload(); }}>Close</button>
                    </div>
                </div>
            )}

            <p style={{ margin: 0, color: isLiveServer ? '#137333' : '#d93025', marginBottom: '15px' }}>
                <strong>{isLiveServer ? '🟢 Live Server Active:' : '🟠 MSW Mocking Active:'}</strong> {isLiveServer ? ' Requests are hitting http://localhost:3001' : ' API requests are being intercepted.'}
            </p>

            {!isLiveServer && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {SCENARIO_LIST.map(scenario => (
                        <div key={scenario.id} style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                            <button
                                onClick={() => handleLoad(scenario.id, scenario.label)}
                                style={{ padding: '6px 12px', border: 'none', background: '#fff', cursor: 'pointer', borderRight: '1px solid #ccc' }}>
                                {scenario.icon} {scenario.label}
                            </button>
                            <button
                                onClick={() => handleAppend(scenario.id, scenario.label)}
                                style={{ padding: '6px 10px', border: 'none', background: '#f0f0f0', cursor: 'pointer' }}
                                title={`Inject ${scenario.label} into current data`}
                            >
                                ➕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};