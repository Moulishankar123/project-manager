import '../src/App.css'
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core'
import AppShell from './Components/Layout/App_Shell'
//import Dnd from './Components/Dnd'


function App() {

  return (
    <>
      <MantineProvider>
        <AppShell /> 
        {/* <Dnd/> */}
      </MantineProvider>
    </>
  )
}

export default App
