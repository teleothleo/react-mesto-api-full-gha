import React, { useEffect, useState } from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import editIcon from '../images/edit.svg';

const Main = (props) => {

   const currentUser = React.useContext(CurrentUserContext);
   console.log("MAIN: " + props);

   return (
      <main className="content">
         <section className="profile">
            <div className="profile__avatar-box">
               <img
                  alt="Аватар"
                  onClick={props.onEditAvatarClick}
                  className="profile__avatar"
                  src={currentUser.avatar}
               />
               <img
                  src={editIcon}
                  alt="Иконка '/изменить'/"
                  className="profile__avatar-edit"
               />
            </div>
            <div className="profile__info">
               <h1 className="profile__name">{currentUser.name}</h1>
               <button onClick={props.onEditProfileClick} className="profile__edit-btn" type="button"></button>
               <p className="profile__job">{currentUser.about}</p>
            </div>
            <button onClick={props.onAddCardClick} className="profile__add-btn" type="button"></button>
         </section>

         <section className="elements">
            {
               props.cards.map((card) => (
                  <Card
                     key={card._id}
                     card={card}
                     onCardClick={props.onCardClick}
                     onCardLike={props.onCardLike}
                     onCardDelete={props.onCardDelete}
                  />
               ))
            }
         </section>
      </main>
   )
}

export default Main;