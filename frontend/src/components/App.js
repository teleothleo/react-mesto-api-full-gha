import '../pages/index.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/Api';
import ProtectedRoute from './ProtectedRoute';
// Components
import Register from './Register';
import Login from './Login';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import InfoTooltip from './InfoTooltip';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Auth from '../utils/Auth';
import { getCookie, removeCookie, saveCookie } from "../utils/cookies";

const App = () => {

  const [editProfilePopupIsOpen, setEditProfilePopupIsOpen] = useState(false);
  const [editAvatarPopupIsOpen, setEditAvatarPopupIsOpen] = useState(false);
  const [addCardPopupIsOpen, setAddCardPopupIsOpen] = useState(false);
  const [infoTooltipPopupIsOpen, setInfoTooltipPopupIsOpen] = useState(false);
  const [infoTooltipMessage, setInfoTooltipMessage] = useState("");
  const [infoTooltipState, setInfoTooltipState] = useState(false);
  const [isSandwichOpened, setIsSandwichOpened] = useState(false);
  const [imgPopupIsOpen, setImgPopupIsOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      getUserInfo();
      fetchCards();
    };
  }, [loggedIn]);

  useEffect(() => {
    checkToken();
  }, []);

  // SignUp & SignIn & Auth & LogOut
  async function handleSignUpSubmit({ email, password }) {
    const auth = new Auth({
      email: email,
      password: password
    });
    const res = auth.signUp();
    try {
      await res.then((res) => {
        console.log("APP: ", res);
        navigate("/sign-in", { replace: true });
        setInfoTooltipPopupIsOpen(true);
        setIsSandwichOpened(false);
        setInfoTooltipMessage("Вы успешно зарегистрировались!");
        setInfoTooltipState(true);
      });
    } catch (error) {
      console.log("App.js catch: ", error);
      setInfoTooltipPopupIsOpen(true);
      setInfoTooltipMessage("Что-то пошло не так!\nПопробуйте ещё раз.");
      setInfoTooltipState(false);
      console.warn(error);
    }
  }

  async function handleSignInSubmit({ email, password }) {
    const auth = new Auth({
      email: email,
      password: password
    });
    const res = auth.signIn();
    try {
      await res.then((res) => {
        console.log('App.js signIn res:', res);
        saveCookie("token", res.token)
        saveCookie("userId", res.user._id)
        saveCookie("email", email)
        setCurrentUser(res.user);
        setEmail(email);
        setLoggedIn(true);
        setIsSandwichOpened(false);
        checkToken() && navigate("/", { replace: true });
      })
    } catch (error) {
      setInfoTooltipPopupIsOpen(true);
      setInfoTooltipMessage("Что-то пошло не так!\nПопробуйте ещё раз.");
      setInfoTooltipState(false);
      console.warn(error);
    }
  }

  async function checkToken() {
    setIsSandwichOpened(false);
    const jwt = getCookie('token');
    const _id = getCookie("userId");
    // console.log(`checkToken:\nuserId: ${_id}\ntoken: ${jwt}`);
    if (jwt) {
      const auth = new Auth({ jwt });
      try {
        auth.authorize().then((res) => {
          setLoggedIn(true)
          navigate("/", { replace: true });
          setIsSandwichOpened(false);
          setEmail(getCookie("email"));
          console.log("Your authorization was successful.");
          return true;
        });
      } catch (error) {
        setLoggedIn(false);
        console.warn(error);
        return false;
      }
    }

  }

  function handleLogOutClickInHeader() {
    removeCookie("token")
    removeCookie("userId")
    navigate("/sign-in", { replace: true });
    setIsSandwichOpened(false);
  }

  function handleSignInClickInHeader() {
    localStorage.removeItem("token");
    navigate("/sign-in", { replace: true });
    setIsSandwichOpened(false);
  }

  function handleSignUpRedirectClickInHeader() {
    navigate("/sign-up", { replace: true });
    setIsSandwichOpened(false);
  }

  function handleSignInRedirectClickInHeader() {
    navigate("/sign-in", { replace: true });
    setIsSandwichOpened(false);
  }

  // Header 
  function handleSandwichClick() {
    setIsSandwichOpened(() => !isSandwichOpened);
  }

  // Profile  
  function handleEditProfileClick() {
    setEditProfilePopupIsOpen(true);
  }

  function handleUpdateUser(userData) {
    api.setUserInfo(userData)
      .then(() => {
        setCurrentUser({ ...currentUser, name: userData.name, about: userData.about });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
      })

  }

  function handleUpdateAvatar(userData) {
    api.updateAvatar(userData.avatar)
      .then(() => {
        console.log({ ...currentUser, avatar: userData.avatar });
        setCurrentUser({ ...currentUser, avatar: userData.avatar });
      })
      .catch(err => {
        console.log({ ...currentUser, avatar: userData.avatar });
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
      })

  }

  function handleEditAvatarClick() {
    setEditAvatarPopupIsOpen(true);
  }

  function getUserInfo() {
    api.getUserInfo()
      .then((userData) => {
        console.log("App.js", userData);
        setCurrentUser(userData);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Places, cards
  function handleAddCardClick() {
    setAddCardPopupIsOpen(true);
  }

  function handleDeleteCardClick(card) {
    api.deleteCard(card._id)
      .then(() => {
        setCards(cards => cards.filter(((cardEl) => { return card._id !== cardEl._id })));
      })
      .catch(err => {
        console.log(err);
      })
  }

  function handleCardClick(cardObj) {
    setImgPopupIsOpen(true);
    setSelectedCard(cardObj);
  }

  function handleAddPlaceSubmit(newCard) {
    api.addNewCard({ place: newCard.place, url: newCard.url })
      .then(res => {
        setCards([res, ...cards]);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
        fetchCards();
      })

  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        closeAllPopups();
      })

  }

  function fetchCards() {
    api.fetchCards()
      .then((cardsData) => {
        // Fetched cards data
        setCards(cardsData);
      })
      .catch(err => {
        console.log(err);
      });
  }

  // Popups
  function closeAllPopups() {
    setEditProfilePopupIsOpen(false);
    setEditAvatarPopupIsOpen(false);
    setAddCardPopupIsOpen(false);
    setImgPopupIsOpen(false);
    setInfoTooltipPopupIsOpen(false)
  }

  return (

    <CurrentUserContext.Provider value={currentUser}>

      <div className="body">

        <Header
          loggedIn={loggedIn}
          isSandwichOpened={isSandwichOpened}
          onSandwichClick={handleSandwichClick}
          onLogOut={handleLogOutClickInHeader}
          onSignIn={handleSignInClickInHeader}
          onSignUpRedirect={handleSignUpRedirectClickInHeader}
          onSignInRedirect={handleSignInRedirectClickInHeader}
          email={email}
        />

        <Routes>

          <Route path='/sign-up' element={
            <Register
              loggedIn={loggedIn}
              onSubmit={handleSignUpSubmit}
            />} />

          <Route path='/sign-in' element={
            <Login
              loggedIn={loggedIn}
              onSubmit={handleSignInSubmit}
            />} />

          <Route path='/' element={
            <>
              <ProtectedRoute
                loggedIn={loggedIn}
                Component={Main}
                onEditAvatarClick={handleEditAvatarClick}
                onEditProfileClick={handleEditProfileClick}
                onAddCardClick={handleAddCardClick}
                onCardClick={handleCardClick}
                onCardDelete={handleDeleteCardClick}
                onCardLike={handleCardLike}
                cards={cards}
              />
              <Footer />
            </>
          }
          />


        </Routes>

        <EditProfilePopup
          isOpen={editProfilePopupIsOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={addCardPopupIsOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={editAvatarPopupIsOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <ImagePopup
          imgText={selectedCard.name}
          imgSrc={selectedCard.link}
          isOpen={imgPopupIsOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          isOpen={infoTooltipPopupIsOpen}
          onClose={closeAllPopups}
          message={infoTooltipMessage}
          state={infoTooltipState}
        />

      </div >

    </CurrentUserContext.Provider>

  );

}

export default App;