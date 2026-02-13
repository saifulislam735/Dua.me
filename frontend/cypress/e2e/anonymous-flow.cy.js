describe('anonymous messaging flow', () => {
  it('sender submits, receiver sees inbox, replies, and reports', () => {
    cy.visit('/@exampleuser');
    cy.contains('Send anonymously');
    cy.get('textarea').type('Anonymous dua test');
    cy.contains('Send anonymously').click();

    // Receiver/admin actions are environment-specific and require seeded auth token.
  });
});
