import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { getGames } from './api';
import Feedback from './components/feedback';
import GuessForm from './components/guess-form';
import Header from './components/header';
import { dateDifferenceInDays, GameData } from './types';
import Item from './components/item';

const startDate = new Date("2024-09-05");
const now = new Date();
const gameIndexOffset = dateDifferenceInDays(startDate, now);
console.log(startDate, now, gameIndexOffset)


const App: React.FC = () => {
  const [game, setGame] = useState<GameData | null>(null)
  const { data, isLoading, isError } = useQuery({ queryKey: ['games'], queryFn: getGames })

  useEffect(() => {
    if (data && data?.length > 0) {
      // setGame(data[gameIndexOffset]);
      const todaysGame = data[gameIndexOffset]
      console.log(todaysGame)
      if (todaysGame) {
        setGame(todaysGame)
      }
    }
  }, [data])

  const [, setGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');

  const handleGuess = (game: GameData, newGuess: string) => {
    setGuess(newGuess);

    const guessedPrice = parseFloat(newGuess);

    if (guessedPrice === game.price) {
      setFeedback('Korrekt! Du gættede rigtigt! 🎉');
    } else if (guessedPrice > game.price) {
      setFeedback('For højt!');
    } else {
      setFeedback('For lavt!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10">
      <Header />
      {isLoading ? <p>Henter dagens pris...</p> : null}
      {isError ? <p>Der skete en fejl</p> : null}
      {!game ? <p>Dagens pris mangler...</p> : null}
      {game ? (
        <>
          <Item game={game} />
          <GuessForm onGuess={(guess) => handleGuess(game, guess)} />
          <Feedback feedback={feedback} />
        </>
      ) : null}
    </div>
  );
};

export default App;
