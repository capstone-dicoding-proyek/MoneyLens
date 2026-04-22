import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '../utils/api/user';

export default function LoginPage() {
  return (
    <section>
      <h1>hello world</h1>
      <GoogleLogin  onSuccess={(credentialResponse) => {
        loginWithGoogle(credentialResponse);
      }}
      onError={() => {
        console.log('Login Failed');
      }} />
    </section>
  );
}