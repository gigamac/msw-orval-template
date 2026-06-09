/**
 * Helper function to load a scenario programmatically behind the scenes.
 * @param {string} scenarioId The ID of the scenario from scenarios.ts
 */
export const loadScenarioProgrammatically = (scenarioId: string) => {
    cy.window().then((win: any) => {
        win.dbService.loadScenario(scenarioId);
    });
    cy.reload(); // Reload to allow the app to fetch the newly seeded data
    cy.contains('Stateful Mock DB Management Panel', { timeout: 10000 }).should('be.visible');
};

/**
 * Helper function to inject a scenario programmatically behind the scenes.
 * @param {string} scenarioId The ID of the scenario from scenarios.ts
 */
export const injectScenarioProgrammatically = (scenarioId: string) => {
    cy.window().then((win: any) => {
        win.dbService.appendScenario(scenarioId);
    });
    cy.reload(); // Reload to allow the app to fetch the injected data
    cy.contains('Stateful Mock DB Management Panel', { timeout: 10000 }).should('be.visible');
};

