import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar }) {

   const inputRef = React.useRef();
   const popupType = "edit-profile";
   const title = "Обновить аватар";
   const submitBtnText = "Сохранить";

   React.useEffect(() => {
      if (isOpen) {
         inputRef.current.value = "";
      }
   }, [isOpen]);

   function handleSubmit(e) {
      e.preventDefault();
      onUpdateAvatar({
         avatar: inputRef.current.value,
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
            className="form__input form__input_img"
            ref={inputRef}
            placeholder="Ссылка на аватар"
            required
            type="url"
            name="img-url"
         />
         <span className="error" id="pic-url-error"></span>

      </PopupWithForm>
   )
}