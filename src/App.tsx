import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getGames } from './api';
import Feedback from './components/feedback';
import GuessForm from './components/guess-form';
import Header from './components/header';
import { dateDifferenceInDays, GameData } from './types';
import Item from './components/item';
import { GuessWithDirection, PrevGuesses } from './components/prev-guesses';

const queryParams = new URLSearchParams(window.location.search);
const dateParam = queryParams.get("date");

const startDate = new Date("2024-09-05");
const now = dateParam ? new Date(dateParam) : new Date();
const gameIndexOffset = dateDifferenceInDays(startDate, now);
console.log(startDate, now, gameIndexOffset)

const guessAttempts = 6;

const App: React.FC = () => {
  const [game, setGame] = useState<GameData | null>(null)
  const { data, isLoading, isError } = useQuery({ queryKey: ['games'], queryFn: getGames })

  useEffect(() => {
    if (data && data?.length > 0) {
      // setGame(data[gameIndexOffset]);
      const todaysGame = data[gameIndexOffset]
      if (todaysGame) {
        setGame(todaysGame)
      }
    }
  }, [data])

  const [guesses, setGuesses] = useState<GuessWithDirection[]>(Array.from(Array(guessAttempts)).map(() => ({ dir: "" })));
  const [guessAttempt, setGuessAttempt] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const handleGuess = (game: GameData, newGuess: string) => {
    if ((guessAttempt + 1) > guessAttempts) {
      return;
    }
    const guessedPrice = parseFloat(newGuess);
    let dir = 'ok';
    if (guessedPrice === game.price) {
      setFeedback('Korrekt! Du gættede rigtigt! 🎉');
    }

    setGuesses(guesses => {
      if (guessedPrice > game.price) {
        dir = 'down'
      } else if (guessedPrice < game.price) {
        dir = 'up'
      }
      guesses[guessAttempt] = {
        guess: guessedPrice,
        dir: dir,
      }
      return guesses;
    });
    setGuessAttempt(currentAttempt => currentAttempt + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <Header />
      {isLoading ? <p>Henter dagens pris...</p> : null}
      {isError ? <p>Der skete en fejl</p> : null}
      {!game ? <p>Dagens pris mangler...</p> : null}
      {game ? (
        <div className="w-96">
          <Item game={game} />
          <p className="text-xl text-center">Gæt {guessAttempt + 1}/{guessAttempts}</p>
          <PrevGuesses guesses={guesses} />
          <GuessForm onGuess={(guess) => handleGuess(game, guess)} />
          <Feedback feedback={feedback} />
        </div>
      ) : null}
    </div>
  );
};

export default App;
