/**
 * Helper function to load a scenario from the control panel and close the confirmation modal.
 * @param {string} scenarioButtonText The text on the scenario button to click.
 * @param {string} expectedModalText The text expected in the success modal.
 */
export const loadAndClose = (scenarioButtonText: string, expectedModalText: string) => {
    cy.contains('button', scenarioButtonText).click();
    cy.contains('Success!').should('be.visible');
    cy.contains(expectedModalText).should('be.visible');
    cy.contains('button', 'Close').click();
};

/**
 * Helper function to inject a scenario from the control panel and close the confirmation modal.
 * @param {string} scenarioTitle The title used in the inject button's `title` attribute.
 * @param {string} expectedModalText The text expected in the success modal.
 */
export const injectAndClose = (scenarioTitle: string, expectedModalText: string) => {
    cy.get(`button[title="Inject ${scenarioTitle} into current data"]`).click();
    cy.contains('Success!').should('be.visible');
    cy.contains(expectedModalText).should('be.visible');
    cy.contains('button', 'Close').click();
};
