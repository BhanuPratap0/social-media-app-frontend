import { createContext, useEffect, useReducer, useState } from 'react';
import AuthReducer from './AuthReducer';

const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [followingArray, setFollowingsArray] = useState([]);
    const [postChange, setPostChange] = useState();
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)

    useEffect(() => {
        
    }, [state.user])

    return (
        <AuthContext.Provider value={{
            followingArray, 
            setFollowingsArray,
            postChange,
            setPostChange,
            user: state.user,
            isFetching: state.isFetching,
            error: state.error,
            dispatch,
        }} >
            {children}
        </AuthContext.Provider>
    );
};