import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import Feedback from "../components/feedback";
import GuessForm from "../components/guess-form";
import { Header } from "../components/header";
import Item from "../components/item";
import { PrevGuesses } from "../components/prev-guesses";
import { ShareButton } from "../components/share-button";
import { getGames } from "../lib/api";
import { getGameState, saveGameState, updateGameStats } from "../lib/storage";
import { calculatePercentageDifference, currency, dateDifferenceInDays, GameData, GameSource, GameSources, getStartDate, guessAttempts, GuessDirection, GuessWithDirection, pickRandom } from "../lib/types";
import CountdownToMidnightUTC from "../components/countdown";

const canSetDate = false;
let dateParam: string | null = null;
if (canSetDate) {
    const queryParams = new URLSearchParams(window.location.search);
    dateParam = queryParams.get("date");
}
const now = dateParam ? new Date(dateParam + 'T00:00:00.000Z') : new Date();

interface GamePageProps {
    mode: 'daily' | 'random';
    source: GameSource;
}
export const GamePage: React.FC<GamePageProps> = ({ mode, source }) => {
    const startDate = getStartDate(source);
    const gameIndexOffset = dateDifferenceInDays(startDate, now);
    const [isExploding, setIsExploding] = React.useState(false);
    const [game, setGame] = useState<GameData | null>(null)
    const { data, isLoading, isError } = useQuery({ queryKey: ['games', mode], queryFn: () => getGames(source, mode === 'random') })

    useEffect(() => {
        if (data && data?.length > 0) {
            let todaysGame: GameData | null = null;
            if (mode === 'daily') {
                todaysGame = data[gameIndexOffset]
            } else if (mode === 'random') {
                let newGameFound = false;
                const maxAttempts = data.length - 1;
                let newGameAttempt = 0;
                while (!newGameFound) {
                    const _todaysGame = pickRandom(data);
                    const gameState = getGameState(_todaysGame.itemId);
                    if (!gameState || gameState.guesses.some(x => !x.guess)) {
                        newGameFound = true;
                        todaysGame = _todaysGame;
                        break;
                    }
                    newGameAttempt++;
                    if (newGameAttempt >= maxAttempts) {
                        newGameFound = true;
                        break;
                    }
                }
            }
            if (todaysGame) {
                setGame(todaysGame)
            }
        }
    }, [data, mode, gameIndexOffset])

    const [guesses, setGuesses] = useState<GuessWithDirection[]>(Array.from(Array(guessAttempts)).map(() => ({ dir: null })));
    const [guessAttempt, setGuessAttempt] = useState<number>(0);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [gameWon, setGameWon] = useState(false);
    const [gameLost, setGameLost] = useState(false);
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (!game) return;
        const gameState = getGameState(game.itemId);
        if (gameState) {
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
            updateGameStats(true, guessAttempt + 1);
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
            updateGameStats(false, guessAttempt + 1);
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

    function handleGameSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('gs', e.target.value);
        window.location.href = currentUrl.toString();
    }

    return (
        <>
            <Header />
            <div>
                {isExploding && <ConfettiExplosion force={0.8} duration={5000} particleCount={250} width={1600} onComplete={() => setIsExploding(false)} />}
                {isLoading ? <p>Henter pris...</p> : null}
                {isError ? <p>Der skete en fejl</p> : null}
                {!game && !isLoading && !isError ? <p>Pris mangler...</p> : null}
                {game ? (
                    <div className="w-80">
                        <div className="flex justify-center mb-4">
                            <select className="p-2 rounded" onChange={handleGameSourceChange} value={source}>
                                {GameSources.map(gs => (
                                    <option key={gs} value={gs}>{gs}</option>
                                ))}
                            </select>
                        </div>
                        <Item game={game} isShaking={isShaking} />
                        {gameWon || gameLost ? (
                            <div className="flex flex-col gap-2 text-center">
                                <Feedback feedback={feedback} />
                                {mode === 'daily' ? (
                                    <>
                                        <p className="mb-4">Prøv igen om {" "}
                                            <CountdownToMidnightUTC />.
                                        </p>
                                        <p>Eller, tryk <a className="link" href={`/random?gs=${source}`}>her</a> for at gætte prisen på en tilfældig vare</p>
                                    </>
                                ) : (
                                    <p><a className="link" href={`/random?gs=${source}`}>Prøv en ny tilfældig vare</a></p>
                                )}
                            </div>
                        ) : (
                            <>
                                <p className="text-xl text-center">Gæt {guessAttempt + 1}/{guessAttempts}</p>
                                <Feedback feedback={feedback} />
                            </>
                        )}
                        <PrevGuesses guesses={guesses} />
                        <div className="mb-8"></div>
                        {!gameWon && !gameLost ?
                            (
                                <GuessForm onGuess={(guess) => handleGuess(game, guess)} />
                            ) : (
                                mode === 'daily' ? (
                                    <ShareButton maxGuesses={guessAttempts} guesses={guesses} gameNumber={gameIndexOffset + 1} gameWon={gameWon} />
                                ) : null
                            )}
                    </div>
                ) : null}
            </div>
        </>
    );
}