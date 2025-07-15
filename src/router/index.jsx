import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import StartPage from '../pages/StartPage/StartPage';
import LoginPage from '../pages/AuthPage/LoginPage';
import FindIdPage from '../pages/AuthPage/FindIdPage.jsx';
import FindPasswordPage from '../pages/AuthPage/FindPasswordPage.jsx';
import SignUpPage from '../pages/AuthPage/SignUpPage';
import MainPage from '../pages/MainPage/MainPage';
import LiveChartPage from '../pages/LiveChartPage/LiveChartPage';
import MyPage from '../pages/MyPage/MyPage';
import EventPage from '../pages/EventPage/EventPage';
import PointChargePage from '../pages/PointChargePage/PointChargePage';
import PointDetailPage from '../pages/PointChargePage/PointDetailPage.jsx';
import HistoryPage from '../pages/HistoryPage/HistoryPage';
import DefaultLayout from '../layout/DefaultLayout';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import TestPage from '../pages/TestPage/TestPage';
import AlarmPage from '../pages/AlarmPage/AlarmPage';
import TradeHistoryPage from '../pages/TradeHistoryPage/TradeHistoryPage';
import CouponPage from '../pages/CouponPage/CouponPage';
import StoragePage from '../pages/StoragePage/StoragePage';
import EditProfilePage from '../pages/EditProfilePage/EditProfilePage';
import ServiceGuidePage from '../pages/ServiceGuidePage/ServiceGuidePage';
import ChargePage from '../pages/ChargePage/ChargePage';
import BuyDataPage from '../pages/TradePage/BuyDataPage/BuyDataPage.jsx';
import SellDataPage from '../pages/TradePage/SellDataPage/SellDataPage.jsx';
import MyGifticonDetail from '@/pages/StoragePage/MyGifticonDetail';

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
    element: <SignUpPage />,
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
        path: '/buydata',
        element: <BuyDataPage />,
      },
      {
        path: '/selldata',
        element: <SellDataPage />,
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
        path: '/shop',
        element: <PointChargePage />,
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
        path: '/guide',
        element: <ServiceGuidePage />,
      },
      {
        path: '/chargePage',
        element: <ChargePage />,
      },
      {
        path: '/point-shop/:id',
        element: <PointDetailPage />,
      },
      {
        path: '/gifticons/:gifticonId',
        element: <MyGifticonDetail />,
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
