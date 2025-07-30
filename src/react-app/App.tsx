import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      {/* تأكد من أن وسم main لا يحتوي على أي className هنا */}
      <main> 
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
