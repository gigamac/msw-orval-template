/**
 * Helper function to close a generic success modal after an action.
 * @param {string} expectedMessage The message to verify in the modal.
 */
export const closeSuccessModal = (expectedMessage: string) => {
    cy.contains('Success!').should('be.visible');
    cy.contains(expectedMessage).should('be.visible');
    cy.contains('button', 'Close').click();
};
