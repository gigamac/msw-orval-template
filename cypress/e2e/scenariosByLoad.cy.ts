/// <reference types="cypress" />

import { injectScenarioProgrammatically, loadScenarioProgrammatically } from "../support/programmaticScenarioLoaders";

describe('Programmatic Scenario Testing', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('/');
        // Wait for MSW to load data
        cy.contains('Stateful Mock DB Management Panel', { timeout: 10000 }).should('be.visible');
    });

    it('a scenario will replace another (programmatically)', () => {
        // Load the Peter scenario programmatically
        loadScenarioProgrammatically('peter');

        // Verify Peter is there and no pets
        cy.contains('h3', 'Active Owners').next('ul').children().should('have.length', 1).and('contain', 'Peter');
        cy.contains('h3', 'Active Pets').next('ul').children().should('have.length', 0);

        // Load the Sylvester scenario programmatically
        loadScenarioProgrammatically('sylvester');

        // Verify Sylvester is there and Peter is gone (replaced)
        cy.contains('h3', 'Active Pets').next('ul').children().should('have.length', 1).and('contain', 'Sylvester');
        cy.contains('h3', 'Active Owners').next('ul').children().should('have.length', 0);
    });

    it('2 scenarios can be added together (programmatically)', () => {
        // First load Peter
        loadScenarioProgrammatically('peter');

        // Inject Sylvester scenario programmatically
        injectScenarioProgrammatically('sylvester');

        // Verify BOTH Peter and Sylvester are there
        cy.contains('h3', 'Active Owners').next('ul').should('contain', 'Peter');
        cy.contains('h3', 'Active Pets').next('ul').should('contain', 'Sylvester');
    });
});
