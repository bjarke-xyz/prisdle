import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from './pages/error-page';
import { GamePage } from './pages/game-page';
import { GameStatsPage } from './pages/game-stats-page';
import { HelpPage } from './pages/help-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <GamePage mode='daily' />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/random",
    element: <GamePage mode='random' />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'stats',
    element: <GameStatsPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'help',
    element: <HelpPage />,
    errorElement: <ErrorPage />,
  }
]);


const App: React.FC = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center py-10'>
      <RouterProvider router={router} />
    </div>
  )
};

export default App;


