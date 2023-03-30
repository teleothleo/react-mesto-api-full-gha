import { getCookie } from "./cookies";

class Api {
   constructor() {
      // this._baseUrl = 'http://localhost:3000';
      this._baseUrl = 'https://api.mestoprj.students.nomoredomains.work';
      this._headers = {
         'Content-Type': 'application/json'
      };
   }

   getUserInfo() {
      const token = getCookie('token');
      const userId = getCookie('_id');
      // console.log(`Api.js:\nuserId: ${this._userId}\ntoken: ${this._token}`);
      return fetch(`${this._baseUrl}/users/me`, {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            '_id': userId,
         }
      })
         .then(this._checkResponse);
   }

   setUserInfo(userData) {
      const userId = getCookie('_id');
      const token = getCookie('token');
      return fetch(`${this._baseUrl}/users/me`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            '_id': userId,
         },
         body: JSON.stringify({
            name: userData.name,
            about: userData.about
         })
      })
         .then(this._checkResponse);
   }

   fetchCards() {
      const token = getCookie('token');
      return fetch(`${this._baseUrl}/cards`, {
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         }
      })
         .then(this._checkResponse);
   }

   addNewCard(inputValues) {
      const userId = getCookie("userId");
      const token = getCookie('token');
      return fetch(`${this._baseUrl}/cards`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
             '_id': userId
         },
         body: JSON.stringify({
            name: inputValues.place,
            link: inputValues.url,
         })
      })
         .then(this._checkResponse);

   }

   deleteCard(id) {
      const token = getCookie('token');
      return fetch(`${this._baseUrl}/cards/${id}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
      })
         .then(this._checkResponse);
   }

   changeLikeCardStatus(id, isLiked) {
      const token = getCookie('token');
      if (isLiked) {
         return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
         })
            .then(this._checkResponse);
      } else {
         return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`,
            },
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
      const token = getCookie('token');
      return fetch(`${this._baseUrl}/users/me/avatar`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
         },
         body: JSON.stringify({
            avatar: url,
         })
      })
         .then(this._checkResponse);
   }

   _checkResponse(res) {
      return res.ok ? res.json() : Promise.reject(res.status);
   }

}

export const api = new Api();
