import React from 'react'
import Card from './Card'
import edit from '../images/edit.svg'
import add from '../images/add.svg'
import { CurrentUserContext } from '../contexts/CurrentUserContext'

function Main({ cards, onEditAvatarClick, onEditProfileClick, onAddPlaceClick, onCardClick, onCardLike, onDeleteClick }) {

  const currentUser = React.useContext(CurrentUserContext)

  return (
    <main className="main">
      <section className="profile">
        <div className="avatar-container" onClick={onEditAvatarClick}>
          <img className="avatar" src={currentUser.avatar} alt="Your custom profile picture"/>
          <button className="avatar-edit"  type="button"></button>
        </div>
        <div className="info">
          <div className="info__name-group">
            <h1 className="info__name">{currentUser.name}</h1>
              <button className="info__edit-button" type="button" onClick={onEditProfileClick}>
                <img className="info__edit-image" src={edit} alt="pencil image"/>
              </button>
          </div>
          <p className="info__caption">{currentUser.about}</p>
        </div>
        <button className="add-button" type="button" onClick={onAddPlaceClick}>
          <img className="add-image" src={add} alt="plus image"/>
        </button>
      </section>

      <section className="cards">
        {cards.map((card) => (
          <Card key={card._id} card={card} onCardClick={onCardClick} onDeleteClick={onDeleteClick} onCardLike={onCardLike} />
        ))}
      </section>
    </main>
  )
}

export default Main