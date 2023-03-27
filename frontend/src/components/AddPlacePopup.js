import {useEffect, useRef} from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddPlacePopup({ isOpen, onClose, onAddPlace }) {

   const placeRef = useRef();
   const urlRef = useRef();

   const popupType = "edit-profile";
   const title = "Новое место";
   const submitBtnText = "Сохранить";

   useEffect(() => {
      if (isOpen) {
         placeRef.current.value = "";
         urlRef.current.value = "";
      }
   }, [isOpen]);

   function handleSubmit(e) {
      e.preventDefault();
      onAddPlace({
         place: placeRef.current.value,
         url: urlRef.current.value,
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
            className="form__input form__input_field-place"
            ref={placeRef}
            placeholder="Название"
            required
            type="text"
            name="place"
            minLength="2"
            maxLength="30"
         />
         <span className="error" id="place-error"></span>
         <input
            className="form__input form__input_field-url"
            ref={urlRef}
            placeholder="Ссылка на картинку"
            required
            type="url"
            name="url"
         />
         <span className="error" id="url-error"></span>

      </PopupWithForm>
   )
}