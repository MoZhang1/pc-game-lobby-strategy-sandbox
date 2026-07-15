import { Fragment, jsx, jsxs } from 'react/jsx-runtime';

// Astryx 0.1.x ships JSX development calls in one production module.
// React's production runtime accepts the same first three arguments as jsxDEV.
export const jsxDEV = jsx;
export { Fragment, jsx, jsxs };
