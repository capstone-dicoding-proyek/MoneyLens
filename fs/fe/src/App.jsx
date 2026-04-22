import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {

  return (
    <main className=''>
      <Routes>
        <Route path='*' element={<LoginPage />} />
      </Routes>
    </main>
  );
}

export default App;
