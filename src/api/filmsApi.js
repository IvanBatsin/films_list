export const fetchFilms = async (pageNumber) => {
  try {
    const req = await fetch(`https://yts.mx/api/v2/list_movies.json?limit=25&page=${pageNumber}`);
    const res = await req.json();
    return {
      totalFilms: res.data.movie_count,
      films: res.data.movies
    }
  } catch (error) {
    console.log(error);
    throw new Error('Fetch films error');
  }
}