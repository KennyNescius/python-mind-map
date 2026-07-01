import { createContext, useContext } from 'react';

/** Maps category id -> hex color, provided around each map so custom nodes can
 *  color themselves from data (categories are configurable, not hardcoded). */
export const CategoryColorContext = createContext<Record<string, string>>({});

export const useCategoryColors = () => useContext(CategoryColorContext);
