import { createSelector } from '@reduxjs/toolkit';

// Base selector
const selectAuth = (state) => state.auth;

// Memoized selectors để tối ưu hiệu năng
export const selectUser = createSelector(
  [selectAuth],
  (auth) => auth.user
);

export const selectAuthLoading = createSelector(
  [selectAuth],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuth],
  (auth) => auth.error
);

export const selectIsAuthenticated = createSelector(
  [selectUser],
  (user) => !!user
);

export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);
