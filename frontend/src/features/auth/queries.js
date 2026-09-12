import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { registerFn, loginFn, logoutFn, logoutAllFn } from './api';
import { setCredentials, logoutUser } from './authSlice';

export const useRegisterMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      // Assuming response contains `data: user` and tokens in cookies
      if (data.success && data.data) {
        dispatch(setCredentials({ user: data.data }));
      }
    },
  });
};

export const useLoginMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (data) => {
      if (data.success && data.data) {
        dispatch(setCredentials({ user: data.data }));
      }
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      dispatch(logoutUser());
    },
  });
};

export const useLogoutAllMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logoutAllFn,
    onSuccess: () => {
      dispatch(logoutUser());
    },
  });
};
