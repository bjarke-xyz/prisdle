import { useEffect, useState } from "react"
import { GameStats, getGameStats } from "../lib/storage"
import { Header } from "../components/header";
import { Bar } from 'react-chartjs-2'
import { BarElement, CategoryScale, Chart, LinearScale } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement)

interface ChartData {
    labels: (string | number)[];
    datasets: {
        data: number[]
    }[]
}

export const GameStatsPage: React.FC = () => {
    const [gameStats, setGameStats] = useState<GameStats | null>();
    useEffect(() => {
        const _gameStats = getGameStats();
        setGameStats(_gameStats)
    }, [setGameStats])
    const [chartData, setChartData] = useState<ChartData>({ datasets: [], labels: [] })
    useEffect(() => {
        if (!gameStats) return;
        setChartData({
            labels: gameStats.winDistribution.map((_, i) => i + 1),
            datasets: [{
                data: gameStats.winDistribution
            }]
        })
    }, [gameStats])
    const options = {
        backgroundColor: 'rgb(37, 99, 235)',
        indexAxis: 'y' as const,
        barThickness: "20"
    }
    return (
        <>
            <Header />
            {gameStats ? (
                <div className="flex flex-col">
                    <div className="flex flex-col items-center">
                        <h3 className="text-3xl mb-4">Statistik</h3>
                        <div className="flex flex-row flex-wrap gap-4">
                            <GameStatMetric label="Spillet" value={gameStats.numberOfGames} />
                            {gameStats.numberOfGames > 0 ?
                                (
                                    <GameStatMetric label="Vundet %" value={Number((gameStats.numberOfWins / gameStats.numberOfGames).toFixed(2)) * 100} />
                                ) : null}
                            <GameStatMetric label="Antal vundet i træk" value={gameStats.currentStreak} />
                            <GameStatMetric label="Højeste antal vundet i træk" value={gameStats.bestStreak} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-2xl">Fordeling af gæt</h2>
                        <Bar data={chartData} options={options} />
                    </div>
                </div>
            ) : null}
        </>
    )
}

interface GameStatMetricProps {
    label: string;
    value: number;
}
export const GameStatMetric: React.FC<GameStatMetricProps> = ({ label, value }) => {
    return (
        <div className="flex flex-col gap-2 items-center max-w-20 text-center">
            <div className="text-2xl">{value}</div>
            <div>{label}</div>
        </div>
    )
}