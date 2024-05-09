import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
};





const userSlice = createSlice({
    name: "user", // Enclose in quotes
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
        },
        signinsuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signinfailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },

        updateUserStart:(state)=>{
            state.loading=true
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser=action.payload
            state.loading=false
            state.error=null

        },
        updateUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false

        }
        ,deleteUserStart:(state)=>{
            state.loading=true;

        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;

        },
        deleteUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        signoutUserStart:(state)=>{
            state.loading=true;

        },
        signoutUserSuccess:(state)=>{
            state.currentUser=null;
            state.loading=false;
            state.error=null;
            localStorage.removeItem('currentUser');

        },
        signoutUserFailure:(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        },
        clearUserError(state) {
            state.error = null;
          },

    },
});

export const { signInStart, signinsuccess, signinfailure,updateUserFailure,updateUserStart,updateUserSuccess,deleteUserFailure,deleteUserStart,deleteUserSuccess,signoutUserFailure,signoutUserStart,signoutUserSuccess ,clearUserError} = userSlice.actions;
export default userSlice.reducer;
