import { closeSuccessModal } from "../support/modals";
import { injectAndClose, loadAndClose } from "../support/uiScenarioLoaders";

describe('Mock vs Live Server Toggle', () => {
    beforeEach(() => {
        // Visit the app before each test
        cy.visit('/');
        // Wait for MSW to load data
        cy.contains('Stateful Mock DB Management Panel', { timeout: 10000 }).should('be.visible');
    });

    it('can switch back and forth between MSW mocks and the live server', () => {
        // Suffixes ensure we don't conflict with lingering data on the Live Server across test runs
        const mockSuffix = Math.floor(Math.random() * 10000).toString();
        const mockOwnerName = `MockOwner ${mockSuffix}`;
        const mockPetName = `MockPet ${mockSuffix}`;

        const liveSuffix = Math.floor(Math.random() * 10000).toString();
        const liveOwnerName = `LiveOwner ${liveSuffix}`;
        const livePetName = `LivePet ${liveSuffix}`;

        // --- 1. MOCK MODE ---
        cy.contains('h3', 'Create Human Record').parent().within(() => {
            cy.get('input[placeholder="Owner Name"]').type(mockOwnerName);
            cy.contains('button', 'Add').click();
        });
        closeSuccessModal(`Successfully added human record: ${mockOwnerName}`);

        cy.contains('h3', 'Create Animal Record').parent().within(() => {
            cy.get('input[placeholder="Pet Name"]').type(mockPetName);
            cy.get('select').select('Dog');
            cy.contains('button', 'Add').click();
        });
        closeSuccessModal(`Successfully added animal record: ${mockPetName}`);

        cy.contains('h3', 'Execute State Linkage (Adoption)').parent().within(() => {
            cy.get('select').first().select(mockOwnerName);
            cy.get('select').last().contains('option', `${mockPetName} (ID:`).then($opt => cy.get('select').last().select($opt.text()));
            cy.contains('button', 'Link Owner to Pet').click();
        });
        closeSuccessModal(`Successfully linked owner ${mockOwnerName} to pet ${mockPetName}!`);

        // --- 2. SWITCH TO LIVE SERVER ---
        cy.contains('button', 'Switch to Live Server').click();
        cy.contains('🟢 Live Server Active', { timeout: 10000 }).should('be.visible');

        // --- 3. LIVE SERVER MODE ---
        cy.contains('h3', 'Create Human Record').parent().within(() => {
            cy.get('input[placeholder="Owner Name"]').type(liveOwnerName);
            cy.contains('button', 'Add').click();
        });
        closeSuccessModal(`Successfully added human record: ${liveOwnerName}`);

        cy.contains('h3', 'Create Animal Record').parent().within(() => {
            cy.get('input[placeholder="Pet Name"]').type(livePetName);
            cy.get('select').select('Cat');
            cy.contains('button', 'Add').click();
        });
        closeSuccessModal(`Successfully added animal record: ${livePetName}`);

        // --- 4. SWITCH BACK TO MOCKS ---
        cy.contains('button', 'Switch to MSW Mocks').click();
        cy.contains('🟠 MSW Mocks Active', { timeout: 10000 }).should('be.visible');

        // --- 5. VERIFY MOCK STATE IS ISOLATED & RESTORED ---
        cy.contains('h3', 'Active Owners').next('ul').contains('li', mockOwnerName);
        cy.contains('h3', 'Active Pets').next('ul').should('contain', mockPetName).and('contain', 'Dog');
        cy.contains('h3', 'Active Owners').next('ul').should('not.contain', liveOwnerName);
        cy.contains('h3', 'Active Pets').next('ul').should('not.contain', livePetName);
    });
});

