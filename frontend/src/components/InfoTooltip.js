import authSuccessIcon from '../images/auth-success.svg';
import authFailIcon from '../images/auth-fail.svg';

const InfoTooltip = ({ isOpen, onClose, message, state }) => {
   // <div className={`popup popup_type_info-tooltip popup_active`}>
   return (
      <div className={`popup popup_type_info-tooltip ${isOpen && "popup_active"}`}>
         <div className="popup__container popup__container_type_form">
            <button onClick={onClose} className="popup__close-btn" type="button"></button>
            <img className="popup__auth-icon" src={state ? authSuccessIcon : authFailIcon}/>
            <h2 className="popup__title popup__title_info-tooltip">{message}</h2>
         </div>
      </div >
   );
}

export default InfoTooltip;