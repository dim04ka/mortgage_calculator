import { CalculatorPage } from './components/CalculatorPage'
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <CalculatorPage />
      <SpeedInsights />
      <Analytics />
    </>
  )
}

export default App
