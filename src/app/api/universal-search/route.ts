import { NextRequest, NextResponse } from 'next/server';

// Extended movie database with popular movies from all eras and genres
const UNIVERSAL_MOVIES = [
  // Action Movies
  { title: "Die Hard", year: 1988, genres: ["Action", "Thriller"], rating: 8.2, plot: "A New York police officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.", poster: "https://m.media-amazon.com/images/M/MV5BZjRlNDUxZjAtOGQ4OC00OTNlLTgwNWMtYTBmNTY4ZTI0OGMxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { title: "Terminator 2: Judgment Day", year: 1991, genres: ["Action", "Sci-Fi"], rating: 8.6, plot: "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son John Connor from a more advanced and powerful cyborg.", poster: "https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { title: "The Bourne Identity", year: 2002, genres: ["Action", "Mystery", "Thriller"], rating: 7.9, plot: "A man is picked up by a fishing boat, bullet-riddled and suffering from amnesia, before racing to elude assassins and attempting to regain his memory.", poster: "https://m.media-amazon.com/images/M/MV5BM2JkNGU0ZGMtZjVjNS00NjgyLWEyOWYtZmRmZGQyN2IxZjA2XkEyXkFqcGdeQXVyNTIzOTk5ODM@._V1_SX300.jpg" },
  { title: "Mission: Impossible", year: 1996, genres: ["Action", "Adventure", "Thriller"], rating: 7.1, plot: "An American agent, under false suspicion of disloyalty, must discover and expose the real spy without the help of his organization.", poster: "https://m.media-amazon.com/images/M/MV5BMTc3NjI2MjU0Nl5BMl5BanBnXkFtZTgwNDk3ODYxMTE@._V1_SX300.jpg" },
  { title: "Speed", year: 1994, genres: ["Action", "Adventure", "Crime"], rating: 7.3, plot: "A young police officer must prevent a bomb exploding aboard a city bus by keeping its speed above 50 mph.", poster: "https://m.media-amazon.com/images/M/MV5BYjc0MjYyNDEtZGRhMy00NzJiLWI2Y2QtYzhiYTU3NzAxNzg4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg" },
  
  // Comedy Movies
  { title: "Groundhog Day", year: 1993, genres: ["Comedy", "Drama", "Fantasy"], rating: 8.0, plot: "A narcissistic, self-centered weatherman finds himself in a time loop on Groundhog Day." },
  { title: "The Hangover", year: 2009, genres: ["Comedy"], rating: 7.7, plot: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing." },
  { title: "Superbad", year: 2007, genres: ["Comedy"], rating: 7.6, plot: "Two co-dependent high school seniors are forced to deal with separation anxiety after their plan to stage a booze-soaked party goes awry." },
  { title: "Anchorman", year: 2004, genres: ["Comedy"], rating: 7.2, plot: "Ron Burgundy is San Diego's top-rated newsman in the male-dominated broadcasting of the 1970s, but that's all about to change for Ron and his cronies when an ambitious woman is hired as a new anchor." },
  { title: "Dumb and Dumber", year: 1994, genres: ["Comedy"], rating: 7.3, plot: "After a woman leaves a briefcase at the airport terminal, a dumb limo driver and his dumber friend set out on a hilarious cross-country road trip to Aspen to return it." },
  
  // Horror Movies
  { title: "The Exorcist", year: 1973, genres: ["Horror"], rating: 8.1, plot: "When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter." },
  { title: "Halloween", year: 1978, genres: ["Horror", "Thriller"], rating: 7.7, plot: "Fifteen years after murdering his sister on Halloween night 1963, Michael Myers escapes from a mental hospital and returns to the small town of Haddonfield, Illinois to kill again." },
  { title: "A Nightmare on Elm Street", year: 1984, genres: ["Horror"], rating: 7.4, plot: "The monstrous spirit of a slain child murderer seeks revenge by invading the dreams of teenagers whose parents were responsible for his untimely death." },
  { title: "The Shining", year: 1980, genres: ["Drama", "Horror"], rating: 8.4, plot: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings from both past and future." },
  { title: "Scream", year: 1996, genres: ["Horror", "Mystery"], rating: 7.4, plot: "A year after the murder of her mother, a teenage girl is terrorized by a masked killer who targets her and her friends by using scary movies as part of a deadly game." },
  
  // Romance Movies
  { title: "The Notebook", year: 2004, genres: ["Drama", "Romance"], rating: 7.8, plot: "A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences." },
  { title: "When Harry Met Sally", year: 1989, genres: ["Comedy", "Drama", "Romance"], rating: 7.7, plot: "Harry and Sally have known each other for years, and are very good friends, but they fear sex would ruin the friendship." },
  { title: "Pretty Woman", year: 1990, genres: ["Comedy", "Romance"], rating: 7.0, plot: "A man in a legal but hurtful business needs an escort for some social events, and hires a beautiful prostitute he meets... only to fall in love." },
  { title: "Ghost", year: 1990, genres: ["Drama", "Fantasy", "Romance"], rating: 7.1, plot: "After a young man is murdered, his spirit stays behind to warn his lover of impending danger, with the help of a reluctant psychic." },
  { title: "Sleepless in Seattle", year: 1993, genres: ["Comedy", "Drama", "Romance"], rating: 6.8, plot: "A recently widowed man's son calls a radio talk-show in an attempt to find his father a partner." },
  
  // Sci-Fi Movies
  { title: "Blade Runner", year: 1982, genres: ["Sci-Fi", "Thriller"], rating: 8.1, plot: "A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to the earth seeking their creator." },
  { title: "Alien", year: 1979, genres: ["Horror", "Sci-Fi"], rating: 8.5, plot: "The crew of a commercial spacecraft encounter a deadly lifeform after investigating an unknown transmission." },
  { title: "E.T. the Extra-Terrestrial", year: 1982, genres: ["Family", "Sci-Fi"], rating: 7.9, plot: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world." },
  { title: "Close Encounters of the Third Kind", year: 1977, genres: ["Drama", "Sci-Fi"], rating: 7.6, plot: "Roy Neary, an electric lineman, has his life turned upside down after a close encounter with a UFO." },
  { title: "2001: A Space Odyssey", year: 1968, genres: ["Sci-Fi"], rating: 8.3, plot: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer." },
  
  // Drama Movies
  { title: "One Flew Over the Cuckoo's Nest", year: 1975, genres: ["Drama"], rating: 8.7, plot: "A criminal pleads insanity and is admitted to a mental institution, where he rebels against the oppressive nurse and rallies up the scared patients." },
  { title: "12 Angry Men", year: 1957, genres: ["Crime", "Drama"], rating: 9.0, plot: "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence." },
  { title: "To Kill a Mockingbird", year: 1962, genres: ["Crime", "Drama"], rating: 8.2, plot: "Atticus Finch, a lawyer in the Depression-era South, defends a black man against an undeserved rape charge, and his children against prejudice." },
  { title: "Good Will Hunting", year: 1997, genres: ["Drama", "Romance"], rating: 8.3, plot: "Will Hunting, a janitor at M.I.T., has a gift for mathematics, but needs help from a psychologist to find direction in his life." },
  { title: "Dead Poets Society", year: 1989, genres: ["Comedy", "Drama"], rating: 8.1, plot: "English teacher John Keating inspires his students to look at poetry with a different perspective of authentic knowledge and feelings." },
  
  // Thriller Movies
  { title: "Seven", year: 1995, genres: ["Crime", "Drama", "Mystery"], rating: 8.6, plot: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives." },
  { title: "Silence of the Lambs", year: 1991, genres: ["Crime", "Drama", "Thriller"], rating: 8.6, plot: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer." },
  { title: "North by Northwest", year: 1959, genres: ["Action", "Adventure", "Mystery"], rating: 8.3, plot: "A New York City advertising executive goes on the run after being mistaken for a government agent by a group of foreign spies." },
  { title: "Rear Window", year: 1954, genres: ["Mystery", "Thriller"], rating: 8.5, plot: "A wheelchair-bound photographer spies on his neighbors from his apartment window and becomes convinced one of them has committed murder." },
  { title: "Vertigo", year: 1958, genres: ["Mystery", "Romance", "Thriller"], rating: 8.3, plot: "A former police detective juggles wrestling with his personal demons and becoming obsessed with a woman who reminds him of a murder case he investigated." }
];

// Add streaming and trailer info to movies
const enhanceMovie = (movie: any, index: number) => {
  const platforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 'Paramount+', 'Apple TV+', 'Peacock'];
  const streamingCount = Math.floor(Math.random() * 3) + 1;
  const streamingOn = platforms.sort(() => 0.5 - Math.random()).slice(0, streamingCount);

  return {
    _id: (index + 100).toString(),
    title: movie.title,
    plot: movie.plot,
    genres: movie.genres,
    year: movie.year,
    runtime: Math.floor(Math.random() * 60) + 90, // Random runtime 90-150 min
    cast: ["Actor 1", "Actor 2", "Actor 3"], // Placeholder
    directors: ["Director Name"], // Placeholder
    imdb: {
      rating: movie.rating,
      votes: Math.floor(Math.random() * 1000000) + 100000,
    },
    poster: movie.poster || `https://via.placeholder.com/300x450/1f2937/ffffff?text=${encodeURIComponent(movie.title)}`,
    streamingOn,
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`,
  };
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    console.log('Universal search request:', { query, page, limit });

    // Import demo movies directly (avoid internal API calls)
    const { demoMovies: importedDemoMovies } = await import('../demo-search/route');
    let demoMovies: any[] = [];

    // Get demo movies by importing the demo data directly
    try {
      // We'll include some demo movies in the results
      demoMovies = [
        {
          _id: "1",
          title: "The Godfather",
          plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
          genres: ["Crime", "Drama"],
          year: 1972,
          runtime: 175,
          cast: ["Marlon Brando", "Al Pacino", "James Caan"],
          directors: ["Francis Ford Coppola"],
          imdb: { rating: 9.2, votes: 1800000 },
          poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
          streamingOn: ["Amazon Prime", "Paramount+"],
          trailerUrl: "https://www.youtube.com/watch?v=UaVTIH8mujA"
        },
        {
          _id: "2",
          title: "The Dark Knight",
          plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
          genres: ["Action", "Crime", "Drama"],
          year: 2008,
          runtime: 152,
          cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
          directors: ["Christopher Nolan"],
          imdb: { rating: 9.0, votes: 2600000 },
          poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg",
          streamingOn: ["HBO Max", "Amazon Prime"],
          trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
        }
      ];

      // Filter demo movies based on search
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        demoMovies = demoMovies.filter(movie =>
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.plot.toLowerCase().includes(searchTerm) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchTerm))
        );
      }
    } catch (error) {
      console.error('Demo movies processing failed:', error);
    }

    // Search universal movies
    const searchTerm = query.toLowerCase().trim();
    let universalMovies = UNIVERSAL_MOVIES;

    if (searchTerm) {
      universalMovies = UNIVERSAL_MOVIES.filter(movie => {
        return (
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.plot.toLowerCase().includes(searchTerm) ||
          movie.genres.some(genre => genre.toLowerCase().includes(searchTerm)) ||
          movie.year.toString().includes(searchTerm) ||
          // Fuzzy matching for common search terms
          (searchTerm.includes('action') && movie.genres.includes('Action')) ||
          (searchTerm.includes('comedy') && movie.genres.includes('Comedy')) ||
          (searchTerm.includes('horror') && movie.genres.includes('Horror')) ||
          (searchTerm.includes('romance') && movie.genres.includes('Romance')) ||
          (searchTerm.includes('sci-fi') && movie.genres.includes('Sci-Fi')) ||
          (searchTerm.includes('drama') && movie.genres.includes('Drama')) ||
          (searchTerm.includes('thriller') && movie.genres.includes('Thriller'))
        );
      });
    }

    // Enhance universal movies with full data
    const enhancedUniversalMovies = universalMovies.slice(0, Math.floor(limit / 2)).map(enhanceMovie);

    // Combine demo and universal movies
    const allMovies = [...demoMovies, ...enhancedUniversalMovies];

    // Remove duplicates and apply pagination
    const uniqueMovies = allMovies.filter((movie, index, self) => 
      index === self.findIndex(m => m.title.toLowerCase() === movie.title.toLowerCase())
    );

    const paginatedMovies = uniqueMovies.slice(0, limit);

    console.log(`Universal search completed, found: ${paginatedMovies.length} movies`);

    return NextResponse.json({
      movies: paginatedMovies,
      total: uniqueMovies.length,
      page,
      limit,
      totalPages: Math.ceil(uniqueMovies.length / limit),
    });

  } catch (error) {
    console.error('Universal search error:', error);
    return NextResponse.json(
      { error: 'Search service temporarily unavailable' },
      { status: 500 }
    );
  }
}
