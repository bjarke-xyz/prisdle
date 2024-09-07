import React from 'react';
import { GamePage } from './pages/game-page';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './pages/error-page';
import { HelpPage } from './pages/help-page';
import { GameStatsPage } from './pages/game-stats-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'stats',
    element: <GameStatsPage />
  },
  {
    path: 'help',
    element: <HelpPage />
  }
]);


const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center pt-10'>
      <RouterProvider router={router} />
    </div>
  )
};

export default App;


