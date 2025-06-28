import { NextRequest, NextResponse } from 'next/server';

// Demo data for Akwaaba Dappathon presentation
const demoMovies = [
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
    title: "Forrest Gump",
    plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    genres: ["Drama", "Romance"],
    year: 1994,
    runtime: 142,
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise"],
    directors: ["Robert Zemeckis"],
    imdb: { rating: 8.8, votes: 2000000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=bLvqoHBptjg"
  },
  {
    _id: "3",
    title: "The Shawshank Redemption", 
    plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genres: ["Drama"],
    year: 1994,
    runtime: 142,
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    directors: ["Frank Darabont"],
    imdb: { rating: 9.3, votes: 2500000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=PLl99DlL6b4"
  },
  {
    _id: "4",
    title: "Pulp Fiction",
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    genres: ["Crime", "Drama"],
    year: 1994,
    runtime: 154,
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    directors: ["Quentin Tarantino"],
    imdb: { rating: 8.9, votes: 2000000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Hulu"],
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY"
  },
  {
    _id: "5",
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
  },
  {
    _id: "6",
    title: "Inception",
    plot: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genres: ["Action", "Sci-Fi", "Thriller"],
    year: 2010,
    runtime: 148,
    cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
    directors: ["Christopher Nolan"],
    imdb: { rating: 8.8, votes: 2300000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Netflix"],
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0"
  },
  {
    _id: "7",
    title: "The Matrix",
    plot: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    genres: ["Action", "Sci-Fi"],
    year: 1999,
    runtime: 136,
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
    directors: ["Lana Wachowski", "Lilly Wachowski"],
    imdb: { rating: 8.7, votes: 1900000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Hulu"],
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8"
  },
  {
    _id: "8",
    title: "Goodfellas",
    plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.",
    genres: ["Biography", "Crime", "Drama"],
    year: 1990,
    runtime: 146,
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci"],
    directors: ["Martin Scorsese"],
    imdb: { rating: 8.7, votes: 1100000 },
    poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjA4YTQyYTBmMjNmXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
    streamingOn: ["Amazon Prime", "Peacock"],
    trailerUrl: "https://www.youtube.com/watch?v=qo5jJpHtI1Y"
  },
  {
    _id: "9",
    title: "Titanic",
    plot: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
    genres: ["Drama", "Romance"],
    year: 1997,
    runtime: 194,
    cast: ["Leonardo DiCaprio", "Kate Winslet", "Billy Zane"],
    directors: ["James Cameron"],
    imdb: { rating: 7.9, votes: 1200000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg",
    streamingOn: ["Paramount+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=2e-eXJ6HgkQ"
  },
  {
    _id: "10",
    title: "The Lion King",
    plot: "A Lion cub crown prince is tricked by a treacherous uncle into thinking he caused his father's death and flees into exile in despair.",
    genres: ["Animation", "Adventure", "Drama"],
    year: 1994,
    runtime: 88,
    cast: ["Matthew Broderick", "Jeremy Irons", "James Earl Jones"],
    directors: ["Roger Allers", "Rob Minkoff"],
    imdb: { rating: 8.5, votes: 1000000 },
    poster: "https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=lFzVJEksoDY"
  },
  {
    _id: "11",
    title: "Interstellar",
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    year: 2014,
    runtime: 169,
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
    directors: ["Christopher Nolan"],
    imdb: { rating: 8.6, votes: 1800000 },
    poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    streamingOn: ["Amazon Prime", "Paramount+"],
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E"
  },
  {
    _id: "12",
    title: "The Avengers",
    plot: "Earth's mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    year: 2012,
    runtime: 143,
    cast: ["Robert Downey Jr.", "Chris Evans", "Scarlett Johansson"],
    directors: ["Joss Whedon"],
    imdb: { rating: 8.0, votes: 1400000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=eOrNdBpGMv8"
  },
  {
    _id: "13",
    title: "Jurassic Park",
    plot: "A pragmatic paleontologist touring an almost complete theme park on an island in Central America is tasked with protecting a couple of kids after a power failure causes the park's cloned dinosaurs to run loose.",
    genres: ["Adventure", "Sci-Fi", "Thriller"],
    year: 1993,
    runtime: 127,
    cast: ["Sam Neill", "Laura Dern", "Jeff Goldblum"],
    directors: ["Steven Spielberg"],
    imdb: { rating: 8.2, votes: 950000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=lc0UehYemOA"
  },
  {
    _id: "14",
    title: "Star Wars: Episode IV - A New Hope",
    plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire's world-destroying battle station.",
    genres: ["Action", "Adventure", "Fantasy"],
    year: 1977,
    runtime: 121,
    cast: ["Mark Hamill", "Harrison Ford", "Carrie Fisher"],
    directors: ["George Lucas"],
    imdb: { rating: 8.6, votes: 1300000 },
    poster: "https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=vZ734NWnAHA"
  },
  {
    _id: "15",
    title: "The Lord of the Rings: The Fellowship of the Ring",
    plot: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    genres: ["Action", "Adventure", "Drama"],
    year: 2001,
    runtime: 178,
    cast: ["Elijah Wood", "Ian McKellen", "Orlando Bloom"],
    directors: ["Peter Jackson"],
    imdb: { rating: 8.8, votes: 1800000 },
    poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=V75dMMIW2B4"
  },
  {
    _id: "16",
    title: "Toy Story",
    plot: "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
    genres: ["Animation", "Adventure", "Comedy"],
    year: 1995,
    runtime: 81,
    cast: ["Tom Hanks", "Tim Allen", "Don Rickles"],
    directors: ["John Lasseter"],
    imdb: { rating: 8.3, votes: 950000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=KYz2wyBy3kc"
  },
  {
    _id: "17",
    title: "Back to the Future",
    plot: "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.",
    genres: ["Adventure", "Comedy", "Sci-Fi"],
    year: 1985,
    runtime: 116,
    cast: ["Michael J. Fox", "Christopher Lloyd", "Lea Thompson"],
    directors: ["Robert Zemeckis"],
    imdb: { rating: 8.5, votes: 1200000 },
    poster: "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=qvsgGtivCgs"
  },
  {
    _id: "18",
    title: "Casablanca",
    plot: "A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.",
    genres: ["Drama", "Romance", "War"],
    year: 1942,
    runtime: 102,
    cast: ["Humphrey Bogart", "Ingrid Bergman", "Paul Henreid"],
    directors: ["Michael Curtiz"],
    imdb: { rating: 8.5, votes: 550000 },
    poster: "https://m.media-amazon.com/images/M/MV5BY2IzZGY2YmEtYzljNS00NTM5LTgwMzUtMzM1NjQ4NGI0OTk0XkEyXkFqcGdeQXVyNDYyMDk5MTU@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=BkL9l7qovsE"
  },
  {
    _id: "19",
    title: "Spider-Man: Into the Spider-Verse",
    plot: "Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.",
    genres: ["Animation", "Action", "Adventure"],
    year: 2018,
    runtime: 117,
    cast: ["Shameik Moore", "Jake Johnson", "Hailee Steinfeld"],
    directors: ["Bob Persichetti", "Peter Ramsey"],
    imdb: { rating: 8.4, votes: 500000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=tg52up16eq0"
  },
  {
    _id: "20",
    title: "Mad Max: Fury Road",
    plot: "In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    year: 2015,
    runtime: 120,
    cast: ["Tom Hardy", "Charlize Theron", "Nicholas Hoult"],
    directors: ["George Miller"],
    imdb: { rating: 8.1, votes: 950000 },
    poster: "https://m.media-amazon.com/images/M/MV5BN2EwM2I5OWMtMGQyMi00Zjg1LWJkNTctZTdjYTA4OGUwZjMyXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Hulu"],
    trailerUrl: "https://www.youtube.com/watch?v=hEJnMQG9ev8"
  },
  {
    _id: "21",
    title: "Parasite",
    plot: "A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.",
    genres: ["Comedy", "Drama", "Thriller"],
    year: 2019,
    runtime: 132,
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong"],
    directors: ["Bong Joon Ho"],
    imdb: { rating: 8.5, votes: 750000 },
    poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
    streamingOn: ["Hulu", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY"
  },
  {
    _id: "22",
    title: "Deadpool",
    plot: "A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.",
    genres: ["Action", "Comedy", "Adventure"],
    year: 2016,
    runtime: 108,
    cast: ["Ryan Reynolds", "Morena Baccarin", "T.J. Miller"],
    directors: ["Tim Miller"],
    imdb: { rating: 8.0, votes: 1000000 },
    poster: "https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=9PWjqgM_CU8"
  },
  {
    _id: "23",
    title: "La La Land",
    plot: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.",
    genres: ["Comedy", "Drama", "Music"],
    year: 2016,
    runtime: 128,
    cast: ["Ryan Gosling", "Emma Stone", "Rosemarie DeWitt"],
    directors: ["Damien Chazelle"],
    imdb: { rating: 8.0, votes: 550000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMzUzNDM2NzM2MV5BMl5BanBnXkFtZTgwNTM3NTg4OTE@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=0pdqf4P9MB8"
  },
  {
    _id: "24",
    title: "John Wick",
    plot: "An ex-hit-man comes out of retirement to track down the gangsters that took everything from him.",
    genres: ["Action", "Crime", "Thriller"],
    year: 2014,
    runtime: 101,
    cast: ["Keanu Reeves", "Michael Nyqvist", "Alfie Allen"],
    directors: ["Chad Stahelski"],
    imdb: { rating: 7.4, votes: 650000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_SX300.jpg",
    streamingOn: ["Peacock", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=C0BMx-qxsP4"
  },
  {
    _id: "25",
    title: "Get Out",
    plot: "A young African-American visits his white girlfriend's parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.",
    genres: ["Horror", "Mystery", "Thriller"],
    year: 2017,
    runtime: 104,
    cast: ["Daniel Kaluuya", "Allison Williams", "Bradley Whitford"],
    directors: ["Jordan Peele"],
    imdb: { rating: 7.7, votes: 600000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_SX300.jpg",
    streamingOn: ["Peacock", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=DzfpyUB60YY"
  },
  {
    _id: "26",
    title: "Wonder Woman",
    plot: "When a pilot crashes and tells of conflict in the outside world, Diana, an Amazonian warrior in training, leaves home to fight a war, discovering her full powers and true destiny.",
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2017,
    runtime: 141,
    cast: ["Gal Gadot", "Chris Pine", "Robin Wright"],
    directors: ["Patty Jenkins"],
    imdb: { rating: 7.4, votes: 650000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMTYzODQzYjQtNTczNC00MzZhLTg1ZWYtZDUxYmQ3ZTY4NzA1XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=1Q8fG0TtVAY"
  },
  {
    _id: "27",
    title: "Black Panther",
    plot: "T'Challa, heir to the hidden but advanced kingdom of Wakanda, must step forward to lead his people into a new future and must confront a challenger from his country's past.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    year: 2018,
    runtime: 134,
    cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"],
    directors: ["Ryan Coogler"],
    imdb: { rating: 7.3, votes: 750000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMTg1MTY2MjYzNV5BMl5BanBnXkFtZTgwMTc4NTMwNDI@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=xjDjIWPwcPU"
  },
  {
    _id: "28",
    title: "Frozen",
    plot: "When the newly crowned Queen Elsa accidentally uses her power to turn things into ice to curse her home in infinite winter, her sister Anna teams up with a mountain man, his playful reindeer, and a snowman to change the weather condition.",
    genres: ["Animation", "Adventure", "Comedy"],
    year: 2013,
    runtime: 102,
    cast: ["Kristen Bell", "Idina Menzel", "Jonathan Groff"],
    directors: ["Chris Buck", "Jennifer Lee"],
    imdb: { rating: 7.4, votes: 650000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMTQ1MjQwMTE5OF5BMl5BanBnXkFtZTgwNjk3MTcyMDE@._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=TbQm5doF_Uc"
  },
  {
    _id: "29",
    title: "The Social Network",
    plot: "As Harvard student Mark Zuckerberg creates the social networking site that would become known as Facebook, he is sued by the twins who claimed he stole their idea, and by the co-founder who was later squeezed out of the business.",
    genres: ["Biography", "Drama"],
    year: 2010,
    runtime: 120,
    cast: ["Jesse Eisenberg", "Andrew Garfield", "Justin Timberlake"],
    directors: ["David Fincher"],
    imdb: { rating: 7.7, votes: 700000 },
    poster: "https://m.media-amazon.com/images/M/MV5BOGUyZDUxZjEtMmIzMC00MzlmLTg4MGItZWJmMzBhZjE0Mjc1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=lB95KLmpLR4"
  },
  {
    _id: "30",
    title: "Guardians of the Galaxy",
    plot: "A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.",
    genres: ["Action", "Adventure", "Comedy"],
    year: 2014,
    runtime: 121,
    cast: ["Chris Pratt", "Vin Diesel", "Bradley Cooper"],
    directors: ["James Gunn"],
    imdb: { rating: 8.0, votes: 1100000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMTAwMjU5OTgxNjZeQTJeQWpwZ15BbWU4MDUxNDYxODEx._V1_SX300.jpg",
    streamingOn: ["Disney+", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=d96cjJhvlMA"
  },
  // Additional Classic Movies
  {
    _id: "31",
    title: "Die Hard",
    plot: "A New York police officer tries to save his wife and several others taken hostage by German terrorists during a Christmas party at the Nakatomi Plaza in Los Angeles.",
    genres: ["Action", "Thriller"],
    year: 1988,
    runtime: 132,
    cast: ["Bruce Willis", "Alan Rickman", "Bonnie Bedelia"],
    directors: ["John McTiernan"],
    imdb: { rating: 8.2, votes: 850000 },
    poster: "https://m.media-amazon.com/images/M/MV5BZjRlNDUxZjAtOGQ4OC00OTNlLTgwNWMtYTBmNTY4ZTI0OGMxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=QIOX44m8ktc"
  },
  {
    _id: "32",
    title: "Terminator 2: Judgment Day",
    plot: "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son John Connor from a more advanced and powerful cyborg.",
    genres: ["Action", "Sci-Fi"],
    year: 1991,
    runtime: 137,
    cast: ["Arnold Schwarzenegger", "Linda Hamilton", "Edward Furlong"],
    directors: ["James Cameron"],
    imdb: { rating: 8.6, votes: 1100000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMGU2NzRmZjUtOGUxYS00ZjdjLWEwZWItY2NlM2JhNjkxNTFmXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=CRRlbK5w8AE"
  },
  {
    _id: "33",
    title: "The Exorcist",
    plot: "When a teenage girl is possessed by a mysterious entity, her mother seeks the help of two priests to save her daughter.",
    genres: ["Horror"],
    year: 1973,
    runtime: 122,
    cast: ["Ellen Burstyn", "Max von Sydow", "Linda Blair"],
    directors: ["William Friedkin"],
    imdb: { rating: 8.1, votes: 400000 },
    poster: "https://m.media-amazon.com/images/M/MV5BYjhmMGMxZDYtMTkyNy00YWVmLTgyYmUtYTdmYjZiODE2ZGY2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Hulu"],
    trailerUrl: "https://www.youtube.com/watch?v=YDGw1MTEe5k"
  },
  {
    _id: "34",
    title: "Groundhog Day",
    plot: "A narcissistic, self-centered weatherman finds himself in a time loop on Groundhog Day.",
    genres: ["Comedy", "Drama", "Fantasy"],
    year: 1993,
    runtime: 101,
    cast: ["Bill Murray", "Andie MacDowell", "Chris Elliott"],
    directors: ["Harold Ramis"],
    imdb: { rating: 8.0, votes: 650000 },
    poster: "https://m.media-amazon.com/images/M/MV5BZWIxNzM5YzQtY2FmMS00Yjc3LWI1ZjUtNGVjMjMzZTIxZTIxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=tSVeDx9fk60"
  },
  {
    _id: "35",
    title: "Blade Runner",
    plot: "A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to the earth seeking their creator.",
    genres: ["Sci-Fi", "Thriller"],
    year: 1982,
    runtime: 117,
    cast: ["Harrison Ford", "Rutger Hauer", "Sean Young"],
    directors: ["Ridley Scott"],
    imdb: { rating: 8.1, votes: 750000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzMzJhZTEtOWM4NS00MTdhLTg0YjgtMjM4MDRkZjUwZDBlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=gCcx85zbxz4"
  },
  {
    _id: "36",
    title: "Alien",
    plot: "The crew of a commercial spacecraft encounter a deadly lifeform after investigating an unknown transmission.",
    genres: ["Horror", "Sci-Fi"],
    year: 1979,
    runtime: 117,
    cast: ["Sigourney Weaver", "Tom Skerritt", "John Hurt"],
    directors: ["Ridley Scott"],
    imdb: { rating: 8.5, votes: 850000 },
    poster: "https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
    streamingOn: ["Hulu", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=LjLamj-b0I8"
  },
  {
    _id: "37",
    title: "The Hangover",
    plot: "Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing.",
    genres: ["Comedy"],
    year: 2009,
    runtime: 100,
    cast: ["Bradley Cooper", "Ed Helms", "Zach Galifianakis"],
    directors: ["Todd Phillips"],
    imdb: { rating: 7.7, votes: 800000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNGQwZjg5YmYtY2VkNC00NzliLTljYTctNzI5NmU3MjE2ODQzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg",
    streamingOn: ["HBO Max", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=tcdUhdOlz9M"
  },
  {
    _id: "38",
    title: "Seven",
    plot: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.",
    genres: ["Crime", "Drama", "Mystery"],
    year: 1995,
    runtime: 127,
    cast: ["Morgan Freeman", "Brad Pitt", "Kevin Spacey"],
    directors: ["David Fincher"],
    imdb: { rating: 8.6, votes: 1600000 },
    poster: "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["Netflix", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=znmZoVkCjpI"
  },
  {
    _id: "39",
    title: "The Silence of the Lambs",
    plot: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    genres: ["Crime", "Drama", "Thriller"],
    year: 1991,
    runtime: 118,
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn"],
    directors: ["Jonathan Demme"],
    imdb: { rating: 8.6, votes: 1400000 },
    poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
    streamingOn: ["Hulu", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=W6Mm8Sbe__o"
  },
  {
    _id: "40",
    title: "E.T. the Extra-Terrestrial",
    plot: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.",
    genres: ["Family", "Sci-Fi"],
    year: 1982,
    runtime: 115,
    cast: ["Henry Thomas", "Drew Barrymore", "Peter Coyote"],
    directors: ["Steven Spielberg"],
    imdb: { rating: 7.9, votes: 400000 },
    poster: "https://m.media-amazon.com/images/M/MV5BMTQ2ODFlMDAtNzdhOC00ZDYzLWE3YTMtNDU4ZGFmZmJmYTczXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    streamingOn: ["Peacock", "Amazon Prime"],
    trailerUrl: "https://www.youtube.com/watch?v=qYAETtIIClk"
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    console.log('Demo search request:', { query, page, limit });

    // Simple and reliable search logic
    let filteredMovies = demoMovies;

    // If no query, return all movies (for featured movies)
    if (!query || !query.trim()) {
      console.log('No search query, returning all movies');
      filteredMovies = demoMovies;
    } else {
      const searchTerm = query.toLowerCase().trim();
      console.log('Searching for:', searchTerm);

      filteredMovies = demoMovies.filter(movie => {
        const matches = (
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.plot.toLowerCase().includes(searchTerm) ||
          movie.genres.join(' ').toLowerCase().includes(searchTerm) ||
          movie.cast.join(' ').toLowerCase().includes(searchTerm) ||
          movie.directors.join(' ').toLowerCase().includes(searchTerm) ||
          movie.year.toString().includes(searchTerm)
        );

        if (matches) {
          console.log('Match found:', movie.title);
        }

        return matches;
      });

      console.log('Total matches found:', filteredMovies.length);
    }

    // Apply pagination
    const paginatedMovies = filteredMovies.slice(skip, skip + limit);

    console.log(`Demo search completed, found: ${filteredMovies.length} movies`);

    // Fallback: if no results found, return some popular movies for demo
    if (filteredMovies.length === 0 && query.trim()) {
      console.log('No matches found, returning popular movies for demo');
      filteredMovies = demoMovies.slice(0, 6); // Return first 6 movies
    }

    // Apply pagination to final results
    const finalPaginated = filteredMovies.slice(skip, skip + limit);

    return NextResponse.json({
      movies: finalPaginated,
      total: filteredMovies.length,
      page,
      limit,
      totalPages: Math.ceil(filteredMovies.length / limit),
    });
  } catch (error) {
    console.error('Demo search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
