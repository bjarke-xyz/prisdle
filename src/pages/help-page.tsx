import { Header } from "../components/header"
import { PrevGuesses } from "../components/prev-guesses"
import { guessAttempts } from "../lib/types"

export const HelpPage: React.FC = () => {
    return (
        <>
            <Header />
            <div className="max-w-80">
                <h3 className="text-2xl">Spillet</h3>
                <p>Gæt varens pris på {guessAttempts} forsøg.</p>
                <p>Forkerte gæt vil give dig et hint om den rigtige pris.</p>

                <h3 className="text-2xl mt-8">Eksempler</h3>
                <PrevGuesses guesses={[{ dir: 'up', guess: 10 }]} />
                <p className="mb-8">Første gæt på 10 kr. er lavere end 25% af varens pris.</p>
                <PrevGuesses guesses={[{ dir: 'down-almost', guess: 18 }]} />
                <p className="mb-8">Næste gæt på 18 kr. er for højt, men inden for 25% af varens pris.</p>
                <PrevGuesses guesses={[{ dir: 'ok', guess: 16 }]} />
                <p>Sidste gæt på 16 kr. er inden for 5% af varens pris, du vandt 🎉!</p>

                <h3 className="text-2xl mt-8">Om</h3>
                <p>Kildekoden er tilgængelig på <a className="link" href="https://github.com/bjarke-xyz/prisdle" target="_blank">GitHub</a></p>
                <p>Inspireret af <a className="link" href="https://costcodle.com" target="_blank">https://costcodle.com</a></p>
            </div>
        </>
    )
}