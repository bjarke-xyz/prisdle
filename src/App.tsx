import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getGames } from './api';
import Feedback from './components/feedback';
import GuessForm from './components/guess-form';
import { currency, dateDifferenceInDays, GameData, GuessDirection, GuessWithDirection } from './types';
import Item from './components/item';
import { getGameState, saveGameState } from './storage';
import ConfettiExplosion from 'react-confetti-explosion';
import { ShareButton } from './components/share-button';
import { PrevGuesses } from './components/prev-guesses';

const queryParams = new URLSearchParams(window.location.search);
const dateParam = queryParams.get("date");

const startDate = new Date("2024-09-05T00:00:00.000Z");
const now = dateParam ? new Date(dateParam + 'T00:00:00.000Z') : new Date();
const gameIndexOffset = dateDifferenceInDays(startDate, now);
// console.log(startDate, now, gameIndexOffset)

const guessAttempts = 6;

const App: React.FC = () => {
  const [isExploding, setIsExploding] = React.useState(false);
  const [game, setGame] = useState<GameData | null>(null)
  const { data, isLoading, isError } = useQuery({ queryKey: ['games'], queryFn: getGames })

  useEffect(() => {
    if (data && data?.length > 0) {
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
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (!game) return;
    const gameState = getGameState();
    if (gameState && gameState.gameId === game.itemId) {
      setGuesses(gameState.guesses);
      setGameWon(gameState.gameWon);
      setGameLost(gameState.gameLost);
    }
  }, [game])

  useEffect(() => {
    if (!game) return;
    let lastGuess: GuessWithDirection | null = null;
    let guessAttempt = 0;
    for (const guess of guesses) {
      if (guess.guess !== undefined && guess.guess !== null) {
        lastGuess = guess;
        guessAttempt++;
      }
    }
    if (!lastGuess || !lastGuess.guess) return;
    setGuessAttempt(guessAttempt);
    const priceText = `Prisen var ${game.price} ${currency}`;
    if (lastGuess.dir === 'ok') {
      setFeedback(['Korrekt! Du gættede rigtigt! 🎉', priceText]);
    } else if (gameLost) {
      setFeedback(["Du tabte 😔", priceText])
    }
  }, [guesses, game, gameLost])

  const handleGuess = (game: GameData, newGuess: string) => {
    if (gameLost || gameWon) {
      return;
    }
    const guessedPrice = parseFloat(newGuess);
    const percentDiff = calculatePercentageDifference(game.price, guessedPrice);
    let _gameWon = false;
    if (percentDiff <= 5) {
      setGameWon(true);
      setIsExploding(true);
      _gameWon = true;
    }

    setGuesses(guesses => {
      let suffix: '-almost' | '' = '';
      if (percentDiff <= 25) {
        suffix = "-almost";
      }
      let dir: GuessDirection = 'ok';
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
      return [...guesses];
    });
    if (!_gameWon) {
      setIsShaking(true);
    }
    if ((guessAttempt + 1) >= guessAttempts && !_gameWon) {
      setGameLost(true);
      return;
    }
    setGuessAttempt(currentAttempt => {
      if ((currentAttempt + 1) >= guessAttempts) {
        return guessAttempts;
      }
      return currentAttempt + 1;
    });
  };

  useEffect(() => {
    if (!game) return;
    saveGameState(game.itemId, guesses, gameWon, gameLost);
  }, [game, guesses, gameWon, gameLost])

  return (
    <div>
      {isExploding && <ConfettiExplosion force={0.8} duration={5000} particleCount={250} width={1600} onComplete={() => setIsExploding(false)} />}
      {isLoading ? <p>Henter dagens pris...</p> : null}
      {isError ? <p>Der skete en fejl</p> : null}
      {!game ? <p>Dagens pris mangler...</p> : null}
      {game ? (
        <div className="w-96">
          <Item game={game} isShaking={isShaking} />
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
            ) : (
              <ShareButton maxGuesses={guessAttempts} guesses={guesses} gameNumber={gameIndexOffset + 1} gameWon={gameWon} />
            )}
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
