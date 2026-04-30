import { useContext } from 'react';
import UserContext from '../contexts/AuthContext';

function useAuth() {
  return useContext(UserContext);
}

export default useAuth;