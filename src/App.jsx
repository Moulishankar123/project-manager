import '../src/App.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core'
import AppShell from './Components/Layout/App_Shell'
//import Login from './Components/Login'
function App() {

  return (
    <>
      <MantineProvider>
        <AppShell /> 
        {/* <Login/> */}
      </MantineProvider>
    </>
  )
}

export default App
