import React from 'react';

export const BackendToggle = () => {
    const isLiveServer = localStorage.getItem('USE_LIVE_SERVER') === 'true';

    const toggleBackend = () => {
        localStorage.setItem('USE_LIVE_SERVER', (!isLiveServer).toString());
        window.location.reload(); // Instantly reloads React to switch MSW/Axios
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: isLiveServer ? '#137333' : '#d93025',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '30px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: 'sans-serif'
        }} onClick={toggleBackend}>
            <strong>{isLiveServer ? '🟢 Live Server Active' : '🟠 MSW Mocks Active'}</strong>
            <span style={{ fontSize: '0.8em', opacity: 0.9 }}>| Click to Switch</span>
        </div>
    );
};