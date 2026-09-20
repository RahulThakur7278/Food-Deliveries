import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { registerFn, loginFn, logoutFn, logoutAllFn, sendOtpFn, verifyOtpFn, resetPasswordFn, googleSignUpFn, googleSignInFn } from './api';
import { setCredentials, logoutUser } from './authSlice';

export const useRegisterMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: registerFn,
    onSuccess: (data) => {
      // Assuming response contains `data: user` and tokens in payload
      if (data.success && data.data) {
        dispatch(setCredentials({ user: data.data, accessToken: data.accessToken }));
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
        dispatch(setCredentials({ user: data.data, accessToken: data.accessToken }));
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

export const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: sendOtpFn,
  });
};

export const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtpFn,
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: resetPasswordFn,
  });
};

export const useGoogleSignUpMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: googleSignUpFn,
    onSuccess: (data) => {
      if (data.success && data.data) {
        dispatch(setCredentials({ user: data.data, accessToken: data.accessToken }));
      }
    },
  });
};

export const useGoogleSignInMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: googleSignInFn,
    onSuccess: (data) => {
      if (data.success && data.data) {
        dispatch(setCredentials({ user: data.data, accessToken: data.accessToken }));
      }
    },
  });
};
