import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      openDialog: {
        open: () => Promise<FolderPath>;
      };
    };
  }
}

interface FolderPath {
  canceled: boolean;
  filePaths: [string];
}

const Hello = () => {
  const handleGetDownloadPath = async () => {
    const result = await window.electron.openDialog.open();
    window.electron.store.set('savePath', result.filePaths[0]);
    // eslint-disable-next-line no-console
    console.log(window.electron.store.get('savePath'));
  };

  return (
    <div>
      <div className="Hello">
        <img width="200px" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <button type="button" onClick={handleGetDownloadPath}>
          Get dir
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
