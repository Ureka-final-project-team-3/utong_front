import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import StartPage from '../pages/StartPage/StartPage';
import LoginPage from '../pages/AuthPage/LoginPage';
import FindIdPage from '../pages/AuthPage/FindIdPage.jsx';
import FindPasswordPage from '../pages/AuthPage/FindPasswordPage.jsx';
import SignupPage from '../pages/AuthPage/SignupPage.jsx';
import MainPage from '../pages/MainPage/MainPage';

import LiveChartPage from '../pages/LiveChartPage/LiveChartPage';
import MyPage from '../pages/MyPage/MyPage';
import EventPage from '../pages/EventPage/EventPage';
import PointChargePage from '../pages/PointChargePage/PointChargePage';
import TradePage from '../pages/TradePage/TradePage';
import HistoryPage from '../pages/HistoryPage/HistoryPage';
import DefaultLayout from '../layout/DefaultLayout';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import TestPage from '../pages/TestPage/TestPage';
import AlarmPage from '../pages/AlarmPage/AlarmPage';

import TradeHistoryPage from '../pages/TradeHistoryPage/TradeHistoryPage';
import CouponPage from '../pages/CouponPage/CouponPage';
import StoragePage from '../pages/StoragePage/StoragePage';
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage';
import NotificationsPage from '../pages/NotificationsPage/NotificationsPage';
import ServiceGuidePage from '../pages/ServiceGuidePage/ServiceGuidePage';

const router = createBrowserRouter([
  {
    path: '/start',
    element: <StartPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/find-id',
    element: <FindIdPage />,
  },
  {
    path: '/find-password',
    element: <FindPasswordPage />,
  },
  {
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '/chart',
        element: <LiveChartPage />,
      },
      {
        path: '/mypage',
        element: <MyPage />,
      },
      {
        path: '/event',
        element: <EventPage />,
      },
      {
        path: '/charge',
        element: <PointChargePage />,
      },
      {
        path: '/trade',
        element: <TradePage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/alarm',
        element: <AlarmPage />,
      },
      {
        path: '/test',
        element: <TestPage />,
      },
      {
        path: '/tradehistory',
        element: <TradeHistoryPage />,
      },
      {
        path: '/coupon',
        element: <CouponPage />,
      },
      {
        path: '/storage',
        element: <StoragePage />,
      },
      {
        path: '/edit-profile',
        element: <EditProfilePage />,
      },
      {
        path: '/notifications',
        element: <NotificationsPage />,
      },
      {
        path: '/guide',
        element: <ServiceGuidePage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
