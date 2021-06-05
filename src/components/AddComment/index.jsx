import React from 'react';
import './style.css';

export const AddComment = ({film, closeModal, addComment}) => {
  const [comment, setComment] = React.useState(film.comment);

  const handleCloseClick = event => {
    if (event.target.classList.contains('overlay') || event.target.classList.contains('add_comment_btn')) {
      closeModal();
    }
  }

  const handleChangeComment = event => {
    setComment(event.target.value);
  }

  return (
    <div onClick={handleCloseClick} className="overlay">
      <div className="modal">
        <div className="modal_header">
          <h3>{film.title_english}</h3>
        </div>
        <div className="modal_content">
          <textarea onChange={handleChangeComment} value={comment} placeholder="Enter comment"></textarea>
          <button onClick={() => addComment(comment)} className="btn add_comment_btn">{film.comment ? 'Edit comment' : 'Add comment'}</button>
        </div>
      </div>
    </div>
  )
}