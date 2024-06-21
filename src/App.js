import { Box, Container } from '@mui/material';
import './App.css';
import MainContent from './components/MainContent';
import { useTheme } from './ThemeContext';

function App() {
  const { toggleTheme, theme } = useTheme();
  return (
    <div className="app">
      <button onClick={toggleTheme} className="theme-toggle-button">
        {theme === "light" ? (
          <i className="bi bi-moon-stars-fill"></i>
        ) : (
          <i className="bi bi-brightness-high"></i>
        )}
      </button>
      <Box sx={{display: "flex", justifyContent: "center", alignItems: "center",minHeight: "100vh" }}>
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </Box>
    </div>
  );
}

export default App;
