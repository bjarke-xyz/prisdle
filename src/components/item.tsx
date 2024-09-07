import { GameData } from "../lib/types"

interface ItemProps {
    game: GameData;
    isShaking: boolean;
}
const Item: React.FC<ItemProps> = ({ game, isShaking }) => {
    return (
        <div className={`rounded-md m-4 p-4 bg-gray-300 text-black flex flex-col items-center ${isShaking ? "animate-shake" : null}`}>
            <img className="max-w-72 my-2 rounded-md" src={game.image} alt={game.name}></img>
            <div className="text-lg font-semibold text-center">{game.name}</div>
        </div>
    )
}

export default Item;