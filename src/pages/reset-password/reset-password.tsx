import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { resetPassword } from '../../services/slices/passwordSlice';
import {
  selectIsPasswordReset,
  selectPasswordError
} from '../../services/selectors/passwordSelectors';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(selectPasswordError);
  const isPasswordReset = useSelector(selectIsPasswordReset);

  useEffect(() => {
    const resetPasswordFlag = localStorage.getItem('resetPassword');
    if (!resetPasswordFlag) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (isPasswordReset) {
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    }
  }, [isPasswordReset, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token') || token;
    dispatch(resetPassword({ password, token: tokenFromUrl }));
  };

  return (
    <ResetPasswordUI
      errorText={error || ''}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
