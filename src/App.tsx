import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getGames } from './api';
import Feedback from './components/feedback';
import GuessForm from './components/guess-form';
import Header from './components/header';
import { currency, dateDifferenceInDays, GameData } from './types';
import Item from './components/item';
import { GuessDirection, GuessWithDirection, PrevGuesses } from './components/prev-guesses';

const queryParams = new URLSearchParams(window.location.search);
const dateParam = queryParams.get("date");

const startDate = new Date("2024-09-05T00:00:00.000Z");
const now = dateParam ? new Date(dateParam + 'T00:00:00.000Z') : new Date();
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

  const [guesses, setGuesses] = useState<GuessWithDirection[]>(Array.from(Array(guessAttempts)).map(() => ({ dir: null })));
  const [guessAttempt, setGuessAttempt] = useState<number>(0);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  const handleGuess = (game: GameData, newGuess: string) => {
    if (gameLost || gameWon) {
      return;
    }
    const priceText = `Prisen var ${game.price} ${currency}`;
    const guessedPrice = parseFloat(newGuess);
    const percentDiff = calculatePercentageDifference(game.price, guessedPrice);
    let dir: GuessDirection = 'ok';
    let _gameWon = false;
    if (percentDiff <= 5) {
      setFeedback(['Korrekt! Du gættede rigtigt! 🎉', priceText]);
      setGameWon(true);
      _gameWon = true;
    }

    setGuesses(guesses => {
      let suffix: '-almost' | '' = '';
      if (percentDiff <= 25) {
        suffix = "-almost";
      }
      if (percentDiff <= 5) {
        dir = 'ok';
      } else if (guessedPrice > game.price) {
        dir = `down${suffix}`
      } else if (guessedPrice < game.price) {
        dir = `up${suffix}`
      }
      guesses[guessAttempt] = {
        guess: guessedPrice,
        dir: dir,
      }
      return guesses;
    });
    if ((guessAttempt + 1) >= guessAttempts && !_gameWon) {
      setFeedback(["Du tabte 😔", priceText])
      setGameLost(true);
      return;
    }
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
          {gameWon ? (
            <Feedback feedback={feedback} />
          ) : gameLost ? (
            <Feedback feedback={feedback} />
          ) : (
            <>
              <p className="text-xl text-center">Gæt {guessAttempt + 1}/{guessAttempts}</p>
              <Feedback feedback={feedback} />
            </>
          )}
          <PrevGuesses guesses={guesses} />
          {!gameWon && !gameLost ?
            (
              <GuessForm onGuess={(guess) => handleGuess(game, guess)} />
            ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default App;


function calculatePercentageDifference(num1: number, num2: number, base = num1) {
  const difference = Math.abs(num1 - num2);
  return (difference / base) * 100;
}
