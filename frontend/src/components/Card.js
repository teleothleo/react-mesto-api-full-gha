import React from "react"
import { CurrentUserContext } from "../contexts/CurrentUserContext"


export default function Card({card, onCardClick, onCardDelete, onCardLike}) {

   const currentUser = React.useContext(CurrentUserContext);
   console.log("Card.js:", "\n", card, "\n", currentUser)
   const isOwn = card.owner._id === currentUser._id;
   const isLiked = card.likes.some(i => i._id === currentUser._id);

   return (
         <article className="element">
            <img onClick={() => onCardClick(card)} src={card.link} alt="" className="element__image" />
            <div className="element__description">
               <h2 className="element__title">{card.name}</h2>
               <div className="element__like-box">
                  <button onClick={() => onCardLike(card)} className={`${isLiked ? "element__like element__like_active" : "element__like"}`}></button>
                  {card.likes.length > 0 && <p className="element__like-count">{card.likes.length}</p>}
               </div>
            </div>
            {isOwn && <button className='element__remove' onClick={() => onCardDelete(card)} />} 

         </article>
   )
}