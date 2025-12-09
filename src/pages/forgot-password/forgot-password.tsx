import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/slices/passwordSlice';
import {
  selectIsEmailSent,
  selectPasswordError
} from '../../services/selectors/passwordSelectors';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const error = useSelector(selectPasswordError);
  const isEmailSent = useSelector(selectIsEmailSent);

  useEffect(() => {
    if (isEmailSent) {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [isEmailSent, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <ForgotPasswordUI
      errorText={(error ?? '') as string}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
