import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/uiSlice.js';

export const useTheme = () => {
  const theme = useSelector((state) => state.ui.theme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return { theme, toggle: () => dispatch(toggleTheme()) };
};
