describe('Realizando requisições para a API', () => {
  context('GET /users', () => {
    it('Deve retornar uma lista de usuários', () => {
      cy.request('GET', 'http://localhost:8000/users').then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).length.to.be.greaterThan(1);
      });
    });
  });
  context('GET /users/:userId', () => {
    it('Deve retornar um único usuário', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8000/users/7aa46dce-e6f2-4e48-8547-da50c955bcde',
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('nome');
      });
    });
    it('Deve retornar um erro quando o usuário for inválido', () => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8000/users/7aa46dce-e6f2-4',
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
        expect(response.body).to.eq('Not Found');
      });
    });
  });
  context('Interceptando solicitações de rede', () => {
    it('Deve fazer a interceptação do POST users/login', () => {
      cy.intercept('POST', 'users/login').as('loginRequest');
      cy.login('dhdessoldi@hotmail.com', '123456');
      cy.wait('@loginRequest').then((interception) => {
        interception.response = {
          statusCode: 200,
          body: {
            success: true,
            message: 'Login bem sucedido!',
          },
        };
      });
      cy.visit('/home');

      cy.getByData('titulo-boas-vindas').should(
        'contain.text',
        'Bem vindo de volta!'
      );
    });
  });
  context('Realizando login via API', () => {
    it('Deve permitir login do usuário Daniel', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8000/users/login',
        body: Cypress.env(),
      }).then((resposta) => {
        expect(resposta.status).to.eq(200);
        expect(resposta.body).is.not.empty;
        expect(resposta.body.user).to.have.property('nome');
        expect(resposta.body.user.nome).to.be.equal('Daniel Hermano Dessoldi');
      });
    });
  });
});
