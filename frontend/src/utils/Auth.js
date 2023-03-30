import { getCookie } from "./cookies";

class Auth {
   constructor({ token, password, email }) {
      this._baseUrl = 'http://localhost:3000';
      this._token = getCookie('token');
      this._userId = getCookie('_id');
      this._headers = {
         'Content-Type': 'application/json',
      };
      this._headersForAuthorization = {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`,
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
      // console.log(`Auth.js:\nuserId: ${this._userId}\ntoken: ${this._token}`);
      return fetch(`${this._baseUrl}/users/me`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this._token}`,
            '_id': this._userId,
         }

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