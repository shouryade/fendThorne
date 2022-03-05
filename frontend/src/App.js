import './App.css';
import Login from './login';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path='/' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
