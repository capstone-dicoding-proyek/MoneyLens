import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router';
import { GuestRoute, PrivateRoute } from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResendVerifikasiEmailPage from '../pages/ResendVerifikasiEmail';
import VerifikasiEmailPage from '../pages/VerifikasiEmail';
import NewPasswordPage from '../pages/NewPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import HistoryPage from '../pages/HistoryPage';
import NotFoundPage from '../pages/NotFoundPage';
import InputTransactionComponent from '../components/InputTransactionComponent';
import TransactionDetailModal from '../components/TransactionItemModal';
import NProgress from '../lib/nprogress';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

const authenticatedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_authenticated',
  component: PrivateRoute,
});

const guestRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_guest',
  component: GuestRoute,
});

const dashboardRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/',
  component: DashboardPage,
});

const historyRoute = createRoute({
  getParentRoute: () => authenticatedRoute,
  path: '/history',
  component: HistoryPage,
});

const loginRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: '/register',
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: '/reset-password',
  component: ForgotPasswordPage,
});

const resendVerificationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/resend-verifikasi-email',
  component: ResendVerifikasiEmailPage,
});

const verifyEmailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/verify-email',
  component: VerifikasiEmailPage,
});

const newPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/verif-reset-token',
  component: NewPasswordPage,
});

const inputTesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inputTes',
  component: InputTransactionComponent,
});

const modalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/modal',
  component: TransactionDetailModal,
});

const routeTree = rootRoute.addChildren([
  authenticatedRoute.addChildren([dashboardRoute, historyRoute]),
  guestRoute.addChildren([loginRoute, registerRoute, forgotPasswordRoute]),
  resendVerificationRoute,
  verifyEmailRoute,
  newPasswordRoute,
  inputTesRoute,
  modalRoute,
]);

export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});

router.subscribe('onBeforeLoad', ({ pathChanged }) => {
  if (pathChanged) {
    NProgress.start();
  }
});

router.subscribe('onLoad', () => {
  NProgress.done();
});
