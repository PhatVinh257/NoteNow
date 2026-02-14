import {Toaster} from 'sonner'
import {BrowserRouter,Routes,Route} from 'react-router'
import Homepage from './pages/Homepage'
function App() {
  
  return (
    <>
    <Toaster richColors/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Homepage />}/>      
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
