/// <reference types="cypress" />

/**
 * Helper function to load a scenario from the control panel and close the confirmation modal.
 * @param {string} scenarioButtonText The text on the scenario button to click.
 * @param {string} expectedModalText The text expected in the success modal.
 */
const loadAndClose = (scenarioButtonText: string, expectedModalText: string) => {
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
const injectAndClose = (scenarioTitle: string, expectedModalText: string) => {
    cy.get(`button[title="Inject ${scenarioTitle} into current data"]`).click();
    cy.contains('Success!').should('be.visible');
    cy.contains(expectedModalText).should('be.visible');
    cy.contains('button', 'Close').click();
};

/**
 * Helper function to close a generic success modal after an action.
 * @param {string} expectedMessage The message to verify in the modal.
 */
const closeSuccessModal = (expectedMessage: string) => {
    cy.contains('Success!').should('be.visible');
    cy.contains(expectedMessage).should('be.visible');
    cy.contains('button', 'Close').click();
};

describe('Scenario Testing', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('/');
        // Wait for MSW to load data
        cy.contains('Stateful Mock DB Management Panel', { timeout: 10000 }).should('be.visible');
    });

    // NOTE: For more robust tests, consider adding `data-testid` attributes to your components.
    // This would make selectors less brittle than relying on text or DOM structure.
    // For example: `cy.get('[data-testid="owners-table"]')` instead of `cy.contains('Active Owners Table').parent()`.

    it('a scenario will replace another', () => {
        // Load the Peter scenario
        loadAndClose('👤 Owner: Peter', 'Loaded Scenario: Owner: Peter');

        // Verify Peter is there and no pets
        cy.contains('h2', 'Active Owners').next('ul').children().should('have.length', 1).and('contain', 'Peter');
        cy.contains('h2', 'Active Pets').next('ul').children().should('have.length', 0);

        // Load the Sylvester scenario
        loadAndClose('🐾 Pet: Sylvester (Cat)', 'Loaded Scenario: Pet: Sylvester (Cat)');

        // Verify Sylvester is there and Peter is gone (replaced)
        cy.contains('h2', 'Active Pets').next('ul').children().should('have.length', 1).and('contain', 'Sylvester');
        cy.contains('h2', 'Active Owners').next('ul').children().should('have.length', 0);
    });

    it('2 scenarios can be added together', () => {
        // First load Peter
        loadAndClose('👤 Owner: Peter', 'Loaded Scenario: Owner: Peter');

        // Verify Peter is there
        cy.contains('h2', 'Active Owners').next('ul').should('contain', 'Peter');

        // Inject Sylvester scenario (the button next to it with ➕)
        injectAndClose('Pet: Sylvester (Cat)', 'Injected Scenario: Pet: Sylvester (Cat)');

        // Verify BOTH Peter and Sylvester are there
        cy.contains('h2', 'Active Owners').next('ul').should('contain', 'Peter');
        cy.contains('h2', 'Active Pets').next('ul').should('contain', 'Sylvester');
    });

    it('an owner in the owners list is shown as owning a dog in the dog list', () => {
        // Load the "Bart & Santa's Helper" scenario
        loadAndClose("🔗 Bart & Santa's Helper", "Loaded Scenario: Bart & Santa's Helper");

        // Grab the Pet ID from the Pets table to ensure it matches
        cy.contains('h2', 'Active Pets').next('ul').contains("li", "Santa's Helper")
            .invoke('text')
            .then((text) => {
                const match = text.match(/ID:\s*(\d+)/);
                cy.wrap(match ? match[1] : null).as('petId');
            });

        // Now check the owners table to see if Bart owns this pet ID
        cy.get('@petId').then((petId) => {
            expect(petId).to.not.be.null;
            cy.contains('h2', 'Active Owners').next('ul').contains('li', 'Bart')
                .should('contain.text', `Linked Pet ID: ${petId}`);
        });
    });

    it('a new owner can be added and linked to a dog', () => {
        // Load Sylvester scenario to have a pet available
        loadAndClose('🐾 Pet: Sylvester (Cat)', 'Loaded Scenario: Pet: Sylvester (Cat)');

        // Create a new owner
        cy.contains('h2', 'Add New Owner').parent().within(() => {
            cy.get('input[placeholder="Owner Name"]').type('Granny');
            cy.contains('button', 'Add').click();
        });
        closeSuccessModal('Successfully added human record: Granny');

        // Verify Granny is in the list
        cy.contains('h2', 'Active Owners').next('ul').should('contain', 'Granny');

        // Link Granny to Sylvester
        cy.contains('h2', 'Link Pet to Owner').parent().within(() => {
            cy.get('select').first().select('Granny'); // Select Human
            cy.get('select').last().select('Sylvester (ID:'); // Select Target Animal
            cy.contains('button', 'Link Owner to Pet').click();
        });
        closeSuccessModal('Successfully linked owner Granny to pet Sylvester!');

        // Verify the link in the Owners table
        cy.contains('h2', 'Active Owners').next('ul').contains('li', 'Granny').within(() => {
            // Ensure the pet ID is no longer "None"
            cy.contains('Linked Pet ID: None').should('not.exist');
            cy.contains(/Linked Pet ID: \d+/).should('exist');
        });
    });

    it('a new dog can be added and linked to an owner', () => {
        // Load Peter scenario to have an owner available
        loadAndClose('👤 Owner: Peter', 'Loaded Scenario: Owner: Peter');

        // Create a new dog
        cy.contains('h2', 'Add New Pet').parent().within(() => {
            cy.get('input[placeholder="Pet Name"]').type('Brian');
            cy.get('select').select('Dog'); // Pet Tag
            cy.contains('button', 'Add').click();
        });
        closeSuccessModal('Successfully added animal record: Brian');

        // Verify Brian is in the list
        cy.contains('h2', 'Active Pets').next('ul').should('contain', 'Brian').and('contain', 'Dog');

        // Link Peter to Brian
        cy.contains('h2', 'Link Pet to Owner').parent().within(() => {
            cy.get('select').first().select('Peter'); // Select Human
            cy.get('select').last().select('Brian (ID:'); // Select Target Animal
            cy.contains('button', 'Link Owner to Pet').click();
        });
        closeSuccessModal('Successfully linked owner Peter to pet Brian!');

        // Verify the link in the Owners table
        cy.contains('h2', 'Active Owners').next('ul').contains('li', 'Peter').within(() => {
            // Ensure the pet ID is no longer "None"
            cy.contains('Linked Pet ID: None').should('not.exist');
            cy.contains(/Linked Pet ID: \d+/).should('exist');
        });
    });
});
