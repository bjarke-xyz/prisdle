import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-600">Pris Gæt</h1>
            <p className="text-lg text-gray-600">Gæt prisen på dagens vare!</p>
        </header>
    );
};

export default Header;
