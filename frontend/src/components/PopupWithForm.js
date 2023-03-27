export default function PopupWithForm({ name, title, submitBtnText, isOpen, onClose, onSubmit, children }) {
   // TODO: form className & name validationForm fix
   return (
      <div className={`popup popup_type_${name} ${isOpen && "popup_active"}`}>
         <div className="popup__container popup__container_type_form">
            <button onClick={onClose} className="popup__close-btn" type="button"></button>
            <h2 className="popup__title">{title}</h2>
            <form className={`form form-${name}`} onSubmit={onSubmit} name={name}>
               {children}
               <button className="form__submit" type="submit">{submitBtnText}</button>
            </form>
         </div>
      </div>
   )
}