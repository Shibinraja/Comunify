import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'common/button/Button';
import Input from 'common/input/Input';
import { useAppDispatch } from '@/hooks/useRedux';
import useLoading from '@/hooks/useLoading';
import { LOGIN } from '../../store/actions/auth.actions';
import authSlice from '../../store/slices/auth.slice';
import { signInInput } from '../interface/signIn.interface';
import { loginSchema } from '@/lib/validation';

const SignIn = () => {
  //   const dispatch = useAppDispatch();
  //   const isLoading = useLoading(LOGIN);
  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<LoginBody>({ resolver: yupResolver(loginSchema) });

  //   const onSubmit: SubmitHandler<LoginBody> = (data) => {
  //     dispatch(authSlice.actions.login(data));
  //   };

  return <div>login page</div>;
};

export default SignIn;
