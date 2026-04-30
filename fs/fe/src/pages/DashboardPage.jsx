import useAuth from '../hooks/useAuth';

export default function DashboardPage(){
  const { user } = useAuth();
  return (
    <section>
      <div>{user.id}</div>
      <div>{user.fullname}</div>
      <div>{user.email}</div>
      <div>{user.verified_email}</div>
    </section>
  );
}