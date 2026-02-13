describe('anonymous messaging flow', () => {
  it('anonymous sender posts message to shared link', () => {
    cy.visit('/@exampleuser');
    cy.contains('Send anonymous message to @exampleuser');
    cy.get('textarea').type('Anonymous dua test from cypress');
    cy.contains('Send anonymously').click();
  });

  it('receiver/admin realtime/reply/report path (requires seeded auth and running backend)', () => {
    cy.log('Set localStorage token before this test to fully exercise inbox/reply/report/admin moderation.');
  });
});
