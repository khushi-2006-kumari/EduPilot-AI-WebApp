import { useSelector } from 'react-redux'; //useSelector: a hook that read data from Redux store
import { useState, useEffect } from 'react';

//we make useIsLight as a custom hook, it will return true if the theme is light, false otherwise
export function useIsLight() {
  const theme = useSelector(state => state.ui.theme); //'state => state.ui.theme', thia is an arrow function, where state: the entire Redux store object, state.ui: go inside the 'ui' slice, state.ui.theme: grab the "theme" from ui slice
  const [systemIsLight, setSystemIsLight] = useState(
    () => window.matchMedia('(prefers-color-scheme: light)').matches //window.matchMedia: an API that checks if the user prefers light or dark mode, '.matches': a boolean value that indicates whether the user prefers light or dark mode
  );
  //the arrow function used 'useState(() =>...)', so that React renders only once,which is efficient, that's why we are passing function instead of value
  // // if we had passed 'useState(window.matchMedia(...))', it would have re-run on every render, making it less efficient

  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');//mediaQuery: used to hold the result object in a variable, window.matchMedia: ask the browser a quetion,'(prefers-color-scheme: light)':the quetion is: is system in light mode
    //we store mediaQuery as a variable, becoz we need to use it twices
    const handleChange = (e) => {  //handlechange: a callback function that fires when system theme changes
      setSystemIsLight(e.matches);
    };

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange); // attach a listener to watch for chnages
    return () => mediaQuery.removeEventListener('change', handleChange);// remove that listener on cleanup
  }, [theme]); //[theme] : dependancy array, this effects re-runs only when theme  changes

  if (theme === 'auto') {
    return systemIsLight;
  }
  return theme === 'light';
}

//summary:
//The hook answer one question: is the current active theme light?--handling three cases:
//user explicitly chose light, user explicitly chose dark, or user left it on auto (follow OS)
