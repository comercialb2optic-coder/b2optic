import { createRoot } from 'react-dom/client';
import App from './App';
import { initMetaPixel } from '@/lib/metaPixel';
import './index.css';

// Antes de renderizar: o PageView precisa sair o quanto antes, e o `fbclid`
// da URL precisa ser guardado antes de qualquer coisa mexer no endereço.
initMetaPixel();

createRoot(document.getElementById('root')!).render(<App />);
