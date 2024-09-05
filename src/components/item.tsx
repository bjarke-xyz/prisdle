import { GameData } from "../types"

interface ItemProps {
    game: GameData;
}
const Item: React.FC<ItemProps> = ({ game }) => {
    return (
        <div className="rounded-md m-4 p-4 bg-gray-300 text-black flex flex-col items-center">
            <img className="max-w-72 my-2 rounded-md" src={game.image}></img>
            <div className="text-lg font-semibold text-center">{game.name}</div>
        </div>
    )
}

export default Item;