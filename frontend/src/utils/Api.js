class Api {
   constructor({ baseUrl, headers }) {
      this._baseUrl = baseUrl;
      this._headers = headers;
      this._token = headers.authorization;
   }

   getUserInfo() {
      return fetch(`${this._baseUrl}/users/me`, {
         headers: this._headers,
      })
         .then(this._checkResponse);
   }

   setUserInfo(userData) {
      return fetch(`${this._baseUrl}/users/me`, {
         method: 'PATCH',
         headers: this._headers,
         body: JSON.stringify({
            name: userData.name,
            about: userData.about
         })
      })
         .then(this._checkResponse);
   }

   fetchCards() {
      return fetch(`${this._baseUrl}/cards`, {
         headers: this._headers,
      })
         .then(this._checkResponse);
   }

   addNewCard(inputValues) {
      return fetch(`${this._baseUrl}/cards`, {
         method: 'POST',
         headers: this._headers,
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
            headers: this._headers,
         })
            .then(this._checkResponse);
      } else {
         return fetch(`${this._baseUrl}/cards/${id}/likes`, {
            method: 'DELETE',
            headers: this._headers,
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
         headers: this._headers,
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

export const api = new Api({
   baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-55',
   headers: {
      authorization: 'a110f406-654f-4c53-bae6-3b8905b49b43',
      'Content-Type': 'application/json'
   },
});