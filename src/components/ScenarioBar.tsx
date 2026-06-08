import React from 'react';
import { SCENARIO_LIST } from '../mocks/scenarios';

interface ScenarioBarProps {
    onActionComplete: (message: string) => void;
    onRefetchData: () => Promise<void> | void;
}

export default function ScenarioBar({ onActionComplete, onRefetchData }: ScenarioBarProps) {
    const handleLoadScenario = async (scenarioId: string, label: string) => {
        if ((window as any).dbService) {
            (window as any).dbService.purgeAndReset(scenarioId);
            await onRefetchData();
            onActionComplete(`Loaded Scenario: ${label}`);
        }
    };

    const handleInjectScenario = async (scenarioId: string, label: string) => {
        if ((window as any).dbService) {
            (window as any).dbService.appendScenario(scenarioId);
            await onRefetchData();
            onActionComplete(`Injected Scenario: ${label}`);
        }
    };

    return (
        <div style={{ padding: '1rem', backgroundColor: '#e9ecef', borderRadius: '6px', marginBottom: '2rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <strong style={{ margin: 0 }}>Load Scenario:</strong>

            {SCENARIO_LIST.map(scenario => (
                <div key={scenario.id} style={{ display: 'flex', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
                    <button onClick={() => handleLoadScenario(scenario.id, scenario.label)} style={{ padding: '0.5rem 1rem', cursor: 'pointer', border: 'none', backgroundColor: '#fff', borderRight: '1px solid #ccc' }} title={scenario.description}>
                        {scenario.icon} {scenario.label}
                    </button>
                    <button onClick={() => handleInjectScenario(scenario.id, scenario.label)} style={{ padding: '0.5rem', cursor: 'pointer', border: 'none', backgroundColor: '#e6f4ea', color: '#28a745' }} title={`Inject ${scenario.label} into current data`}>
                        ➕
                    </button>
                </div>
            ))}
        </div>
    );
}