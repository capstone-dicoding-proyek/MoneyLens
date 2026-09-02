import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 150,
  minimum: 0.15,
  easing: 'ease',
  speed: 300,
});

let activeRequests = 0;

export const startProgress = () => {
  if (activeRequests === 0) {
    NProgress.start();
  }
  activeRequests++;
};

export const stopProgress = () => {
  if (activeRequests > 0) {
    activeRequests--;
  }
  if (activeRequests === 0) {
    NProgress.done();
  }
};

export const forceStopProgress = () => {
  activeRequests = 0;
  NProgress.done();
};

export default NProgress;
