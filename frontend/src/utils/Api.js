import { getCookie } from "./cookies";

class Api {
   constructor() {
      this._token = getCookie('token');
      this._userId = getCookie('id');
      this._baseUrl = 'http://localhost:3000';
      this._headers = {
         'Content-Type': 'application/json'
      };
      this._headersWithToken = {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${this._token}`,
      };
   }

   getUserInfo() {
      if (!this._token || !this._userId) {
         this._updateCookies();
      }
      console.log(`Api.js:\nuserId: ${this._userId}\ntoken: ${this._token}`);
      return fetch(`${this._baseUrl}/users/me`, {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this._token}`,
            '_id': this._userId,
         }
      })
         .then(this._checkResponse);
   }

   setUserInfo(userData) {
      return fetch(`${this._baseUrl}/users/me`, {
         method: 'PATCH',
         headers: this._headersWithToken,
         body: JSON.stringify({
            name: userData.name,
            about: userData.about
         })
      })
         .then(this._checkResponse);
   }

   fetchCards() {
      if (!this._token || !this._userId) {
         this._updateCookies();
      }
      return fetch(`${this._baseUrl}/cards`, {
         headers: this._headersWithToken,
      })
         .then(this._checkResponse);
   }

   addNewCard(inputValues) {
      return fetch(`${this._baseUrl}/cards`, {
         method: 'POST',
         headers: this._headersWithToken,
         body: JSON.stringify({
            name: inputValues.place,
            link: inputValues.url
         })
      })
         .then(this._checkResponse);

   }

   deleteCard(id) {
      return fetch(`${this._baseUrl}/cards/${id}`, {
         method: 'DELETE',
         headers: this._headers,
      })
         .then(this._checkResponse);
   }

   changeLikeCardStatus(id, isLiked) {
      if (isLiked) {
         return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'PUT',
            headers: this._headersWithToken,
         })
            .then(this._checkResponse);
      } else {
         return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: this._headersWithToken,
         })
            .then(this._checkResponse);
      }
   }

   getAvatar() {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
         method: 'GET',
         headers: this._headers,
      })
         .then(this._checkResponse);
   }

   updateAvatar(url) {
      return fetch(`${this._baseUrl}/users/me/avatar`, {
         method: 'PATCH',
         headers: this._headersWithToken,
         body: JSON.stringify({
            avatar: url,
         })
      })
         .then(this._checkResponse);
   }

   _updateCookies() {
      this._token = getCookie('token');
      this._userId = getCookie('id');
      this._headersWithToken = {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${this._token}`,
      };
   }

   _checkResponse(res) {
      return res.ok ? res.json() : Promise.reject(res.status);
   }

}

export const api = new Api();
