import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <main>
        {/* The Outlet component renders the current page's content */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
