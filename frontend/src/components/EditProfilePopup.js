import React, { useState } from "react"
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import PopupWithForm from "./PopupWithForm";

export default function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const popupType = "edit-profile";
   const title = "Редактировать профиль";
   const submitBtnText = "Сохранить";

   const currentUser = React.useContext(CurrentUserContext);

   React.useEffect(() => {
      setName(currentUser.name);
      setDescription(currentUser.about);
   }, [currentUser, isOpen]);

   function handleNameChange(e) {
      setName(e.target.value);
   }
   function handleDescriptionChange(e) {
      setDescription(e.target.value);
   }

   function handleSubmit(e) {
      e.preventDefault();
      onUpdateUser({
         name: name,
         about: description,
      });
   }

   return (
      <PopupWithForm
         name={popupType}
         title={title}
         submitBtnText={submitBtnText}
         isOpen={isOpen}
         onClose={onClose}
         onSubmit={handleSubmit}
      >
         <input
            value={name || ''}
            onChange={handleNameChange}
            className="form__input form__input_field-name"
            placeholder="Имя"
            required
            type="text"
            name="name"
            minLength="2"
            maxLength="40"
         />
         <span className="error" id="name-error"></span>
         <input
            value={description || ''}
            onChange={handleDescriptionChange}
            className="form__input form__input_field-job"
            placeholder="Специальность"
            required
            type="text"
            name="job"
            minLength="2"
            maxLength="200"
         />
         <span className="error" id="job-error"></span>

      </PopupWithForm>
   )
}