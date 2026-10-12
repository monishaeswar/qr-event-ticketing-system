// Re-exported so components can `import { useAuth } from '../hooks/useAuth'`
// consistently with the other custom hooks in this folder, without
// duplicating the context/provider logic that lives in AuthContext.jsx.
export { useAuth } from '../context/AuthContext';
