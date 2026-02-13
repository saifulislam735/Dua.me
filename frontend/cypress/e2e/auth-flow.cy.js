describe('auth flow', () => {
  it('magic link login ui renders', () => {
    cy.visit('/login');
    cy.contains('Send magic link');
    cy.contains('Sign in with Google');
  });

  it('google/profile/share flow requires external oauth config in environment', () => {
    cy.log('Configure Google OAuth callback and credentials to run this flow end-to-end.');
  });
});
