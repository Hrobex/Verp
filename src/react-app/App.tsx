import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      {/* أضفنا الهامش العلوي هنا */}
      <main className="pt-20"> 
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
