import React from "react";
import { Route, Routes, Redirect, useNavigate } from "react-router-dom";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeletePopup from "./DeletePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { register, login, checkToken } from "../utils/auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(undefined);
  const [selectedDeleteCard, setSelectedDeleteCard] = React.useState(undefined);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [formValidity, setFormValidity] = useState(true);
  const [errorMessage, setErrorMessage] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [status, setStatus] = useState("");
  const [toggleMenu, setToggleMenu] = useState(false);

  const history = useNavigate();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeleteClick(card) {
    setIsDeletePopupOpen(true);
    setSelectedDeleteCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    api
      .toggleLike({ cardId: card._id, isLiked })
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleDeleteCard(card) {
    api
      .deleteCard({ cardId: card._id })
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(currentUser) {
    api
      .editProfile({ name: currentUser.name, about: currentUser.about })
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(currentUser) {
    api
      .editAvatar({ avatar: currentUser.avatar })
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setSelectedCard(undefined);
  }

  const checkValidity = (evt) => {
    const name = evt.target.name;
    setErrorMessage({ ...errorMessage, [name]: evt.target.validationMessage });
  };

  const onFormUpdate = (data) => {
    data ? setFormValidity(true) : setFormValidity(false);
  };

  const handleTokenCheck = () => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history("/");
          } else {
            localStorage.removeItem("jvt");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setToggleMenu(false);
    localStorage.removeItem("jwt");
    history("/signin");
  };

  const onRegister = (password, email) => {
    register(password, email)
      .then((res) => {
        if (res.data._id) {
          console.log("res OK");
          setStatus("success");
          history("/signin");
        } else {
          console.log("Something went wrong.");
          setStatus("failed");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("failed");
        setTooltipOpen(true);
      });
  };

  const onLogin = (password, email) => {
    if (!password || !email) {
      setStatus("failed");
      setTooltipOpen(true);
      return;
    }
    login(password, email)
      .then((data) => {
        if (data.token) {
          handleLogin();
          history("/");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("failed");
        setTooltipOpen(true);
      });
  };

  React.useEffect(() => {
    function closeByEscape(e) {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    }
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((info) => setCurrentUser(info))
      .catch((err) => console.log(err));
    api
      .getCardList()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(err));
    handleTokenCheck();
  }, []);

  return (
    <div className="root">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="content">
          <Header
            loggedIn={loggedIn}
            handleLogout={handleLogout}
            email={localStorage.email}
            toggleNav={toggleNav}
            toggleMenu={toggleMenu}
          />

          <Routes>
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main
                    onEditAvatarClick={handleEditAvatarClick}
                    onEditProfileClick={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleConfirmationClick}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/signin" element={<Login onLogin={onLogin} />} />
            <Route
              path="/signup"
              element={<Register onRegister={onRegister} />}
            />
            <Route
              path="*"
              element={
                loggedIn ? (
                  <Redirect to="/" replace />
                ) : (
                  <Redirect to="/signin" replace />
                )
              }
            />
          </Routes>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            formValidity={formValidity}
            onInputUpdate={checkValidity}
            onFormUpdate={onFormUpdate}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            formValidity={formValidity}
            onInputUpdate={checkValidity}
            onFormUpdate={onFormUpdate}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            formValidity={formValidity}
            onInputUpdate={checkValidity}
            onFormUpdate={onFormUpdate}
          />

          <DeletePopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleDeleteCard}
            card={selectedDeleteCard}
            formValidity={formValidity}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip
            isOpen={tooltipOpen}
            onClose={closeAllPopups}
            status={status}
          />
        </div>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
