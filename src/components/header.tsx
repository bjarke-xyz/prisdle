import { useLocation } from "react-router-dom"

export const Header: React.FC = () => {
    const { pathname } = useLocation();
    // If updating static elements, remember to update index.html too
    return (
        <header className="text-center mb-8">
            <div className="flex flex-row justify-center items-center gap-4">
                <a className="text-2xl" title="Hjælp" href={pathname === "/help" ? "/" : "/help"}>❓</a>
                <h1 className="text-4xl font-bold text-blue-600">
                    <a href="/">
                        Pris Gæt
                    </a>
                </h1>
                <a className="text-2xl" title="Statistik" href={pathname === "/stats" ? "/" : "/stats"}>📊</a>
            </div>
            <h2 className="text-lg text-gray-600">Gæt prisen på dagens vare</h2>
        </header>
    )
}