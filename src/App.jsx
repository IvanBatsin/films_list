import React from 'react';
import './style.css';
import ReactPaginate from 'react-paginate';
import { fetchFilms } from './api/filmsApi';
 
import { Loader } from './components/Loader/index';
import { AddComment } from './components/AddComment';

export const App = () => {
  const [loading, setLoading] = React.useState(true);
  const [allFilms, setAllFilms] = React.useState({});
  const [totalFilms, setTotalFilms] = React.useState(0);
  const [currentFilmIndex, setCurrentFilmIndex] = React.useState(undefined);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [displayFilms, setDisplayFilms] = React.useState([]);

  const filmsPerPage = 25;
  const pageCount = Math.ceil(totalFilms / filmsPerPage);

  const openModal = (index) => {
    setCurrentFilmIndex(index);
    setModalVisible(true);
  }

  const closeModal = () => setModalVisible(false);

  const addComment = (comment) => {
    setAllFilms(prevState => {
      const arr = prevState[currentPage];
      arr[currentFilmIndex].comment = comment;
      return {
        ...prevState,
        [currentPage]: [...arr]
      }
    });
  }

  const handlePageClick = async (data) => {
    if (loading) return;

    if (!allFilms[data.selected + 1]) {
      const { films } = await fetchFilms(data.selected + 1);
      setAllFilms(prevState => ({
        ...prevState,
        [data.selected + 1]: films
      }));

      setDisplayFilms(prevState => films);
    } else {
      setDisplayFilms(prevState => allFilms[data.selected + 1]);
    }
    
    setCurrentPage(data.selected + 1);
  }

  const initialFecthFilms = async (pageNumber) => {
    try { 
      const { totalFilms, films } = await fetchFilms(pageNumber);
      setTotalFilms(totalFilms);
      setAllFilms(prevState => ({
        ...prevState,
        [pageNumber]: films
      }));
      setDisplayFilms(prevState => films);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    initialFecthFilms(currentPage);
  }, []);

  return (
    <div className="container">
      {modalVisible && 
        <AddComment 
          closeModal={closeModal} 
          film={allFilms[currentPage][currentFilmIndex]}
          addComment={addComment}/>
      }
      {loading ? 
        <Loader/>
      : 
        <>
          <h1>Movies List</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Genres</th>
                <th>Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {displayFilms && displayFilms.map((film, index) => {
                return (
                  <tr key={film.id}>
                    <td data-label="Title">{film.title_english}</td>
                    <td data-label="Year">{film.year}</td>
                    <td data-label="Genres">{film.genres?.join(', ') || 'Unknown'}</td>
                    <td data-label="Rating">{film.rating}</td>
                    <td className="comment" data-label="Comment">{<button onClick={() => openModal(index)}>{film.comment ? 'Show comment' : 'Add Comment'}</button>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel={'prev'}
            nextLabel={'next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            initialPage={currentPage - 1}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </>
      }
    </div>
  )
}