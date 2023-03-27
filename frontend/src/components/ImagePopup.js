export default function ImagePopup({isOpen, onClose, imgSrc, imgText}) {
   // console.log("ISOPEN" + props.isOpen);
   // TODO: form className & name validationForm fix
   return (
      <>
         <div className={`popup popup_type_img ${isOpen && "popup_active"}`}>
            <div className="popup__container popup__container_type_pic">
               <button onClick={onClose} className="popup__close-btn" type="button"></button>
               <img
                  className="popup__image"
                  src={imgSrc}
                  alt="Картинка, на которую нажали"
               />
               <p className="popup__text">{imgText}</p>
            </div>
         </div>
      </>
   )
}