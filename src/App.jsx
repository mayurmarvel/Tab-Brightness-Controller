import React, { useState, useEffect } from 'react';
import './App.css';
import { Slider } from "./components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip"


function App() {
  const [brightness, setBrightness] = useState(100); 

  // Function to handle slider change
  const handleSliderChange = async (value) => {
    setBrightness(value); 

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (brightness, tabId) => {
        const normalizedBrightness = brightness / 100;
        document.documentElement.style.filter = `brightness(${normalizedBrightness})`;
        chrome.storage.local.set({ [`brightness_${tabId}`]: normalizedBrightness }).then(() => {
          // console.log("Value is set");
        });
      },
      args: [value, tab.id]
    });
  }

  // useEffect to retrieve value from local storage on page load
  useEffect(() => {
    async function getBrightnessFromStorage() {
      let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.storage.local.get([`brightness_${tab.id}`], (result) => {
        const storedBrightness = result[`brightness_${tab.id}`];
        if (storedBrightness !== undefined) {
          setBrightness(storedBrightness * 100); // Multiply by 100 to convert to slider range
        }
      });
    }

    getBrightnessFromStorage();
  }, []);

  return (
    <div id="wrapper" className='p-3 flex min-w-56 flex-col items-center gap-2 bg-green-200'>
      <div id="header-wrapper" className=' flex gap-3 items-center'>
      <p className='text-base font-mono font-bold'>Tab Brightness</p>
      <a href="https://github.com/mayurmarvel/Tab-Brightness-Controller" target='_blank'>
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-github">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
      <path d="M9 18c-4.51 2-5-2-7-2"/>
    </svg>
  </a>

  <TooltipProvider delayDuration="100">
      <Tooltip>
        <TooltipTrigger asChild>
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="red" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-heart">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
    </TooltipTrigger>
        <TooltipContent>
          <p>Made with 💗 by 0xMayur</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>

      </div>
      <div id="slider-wrapper" className=' w-60 flex gap-3 px-5'>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun-dim"><circle cx="12" cy="12" r="4"/><path d="M12 4h.01"/><path d="M20 12h.01"/><path d="M12 20h.01"/><path d="M4 12h.01"/><path d="M17.657 6.343h.01"/><path d="M17.657 17.657h.01"/><path d="M6.343 17.657h.01"/><path d="M6.343 6.343h.01"/></svg>
          <Slider
            className='max-w-48 cursor-pointer'
            value={[brightness]}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
            />
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        </div>
    </div>
  );
}

export default App;
