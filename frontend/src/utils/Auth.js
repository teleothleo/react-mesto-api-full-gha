class Auth {
   constructor({ jwt, password, email }) {
      this._baseUrl = 'https://auth.nomoreparties.co';
      this._headers = {
         'Content-Type': 'application/json',
      };
      this._headersForAuthorization = {
         'Content-Type': 'application/json',
         "Authorization": `Bearer ${jwt}`
      };
      this._body = JSON.stringify({
         "password": password,
         "email": email
      });
   }

   signUp() {
      return fetch(`${this._baseUrl}/signup`, {
         method: 'POST',
         headers: this._headers,
         body: this._body
      })
      .then(this._checkResponse);
   }

   signIn() {
      return fetch(`${this._baseUrl}/signin`, {
         method: 'POST',
         headers: this._headers,
         body: this._body
      })
      .then(this._checkResponse);
   }

   authorize() {
      return fetch(`${this._baseUrl}/users/me`, {
         method: 'GET',
         headers: this._headersForAuthorization,
      })
         .then(this._checkResponse);
   }

   _checkResponse(res) {
      if (res.ok) {
         return res.json();
      } else {
         return Promise.reject(res);
      }

   }
}

export default Auth;