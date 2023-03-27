import logoWhite from '../images/logo-white.svg';
import { Routes, Route } from 'react-router-dom'

const Header = ({ loggedIn, isSandwichOpened, onSandwichClick, onLogOut, onSignIn, onSignUpRedirect, onSignInRedirect, email }) => {

   return (
      <header className="header">


         <Routes>
            <Route path='/' element={
               <div className='header__mob-helper'>

                  {/* Main: Mobile Box */}
                  <div className={`header__auth-box-mob ${isSandwichOpened && "header__auth-box-mob_active"}`}>
                     <a className="header__email">{email}</a>
                     <a onClick={loggedIn ? onLogOut : onSignIn} className="header__log-out">{`${loggedIn ? "Выйти" : "Войти"}`}</a>
                  </div>

                  <div className='header__box'>
                     <img
                        src={logoWhite}
                        alt="Место"
                        className="header__logo"
                     />
                     {/* Main */}
                     <div className='header__auth-box'>
                        {/* Main: Mobile Sandwich */}
                        <button className={`header__sandwich-btn ${isSandwichOpened && "header__sandwich-btn_active"}`}
                           onClick={onSandwichClick} />
                        <a className="header__email">{email}</a>
                        <a onClick={onLogOut} className="header__log-out">{`${loggedIn ? "Выйти" : "Войти"}`}</a>
                     </div>
                  </div>

               </div>
            } />
            {/* Sign Up */}
            <Route path="/sign-up" element={
               <>
                  <img
                     src={logoWhite}
                     alt="Место"
                     className="header__logo"
                  />
                  <a onClick={onSignInRedirect} className="header__auth">{`${loggedIn ? "Выйти" : "Войти"}`}</a>
               </>
            } />
            {/* Sign In */}
            <Route path="/sign-in" element={
               <>
                  <img
                     src={logoWhite}
                     alt="Место"
                     className="header__logo"
                  />
                  <a onClick={onSignUpRedirect} className="header__auth">Регистрация</a>
               </>
            } />

         </Routes>
      </header>
   )
}

export default Header;