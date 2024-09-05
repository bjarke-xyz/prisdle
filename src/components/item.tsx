import { GameData } from "../types"

interface ItemProps {
    game: GameData;
}
const Item: React.FC<ItemProps> = ({ game }) => {
    return (
        <div>
            <div>{game.name}</div>
            <img src={game.image}></img>
        </div>
    )
}

export default Item;