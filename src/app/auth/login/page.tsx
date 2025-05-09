import { LoginForm } from '@/components';
import { titleFont } from '@/config/fonts';

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen pt-32 sm:pt-52">

      <h1 className={ `${ titleFont.className } text-4xl mb-5` }>Ingresar</h1>

      <LoginForm />

    </div>
  );
}