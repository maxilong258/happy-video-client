import { MainLayout } from '../layout/main'
import { Dashboard } from '@/views/Dashboard'
import { StudioLayout } from '@/layout/studio'
import { Uploads } from '@/views/Uploads'
import { Auditorium } from '@/views/Auditorium'
import { Home } from '@/views/Home'
import { Profile } from '@/views/Profile'
import { Creator } from '@/views/Creator'
import { Following } from '@/views/Following'
import { Followers } from '@/views/Followers'
import { Collection } from '@/views/Collection'
import { SearchResult } from '@/views/SearchResult'

export const routes = [
  {
    path: '/',
    element: <MainLayout />,
    name: 'main',
    children: [
      {
        path: '/',
        name: 'Home',
        element: <Home />,
        routeName: 'home'
      },
      {
        path: '/auditorium/:id',
        element: <Auditorium />,
        name: 'Auditorium',
        routeName: 'auditorium'
      },
      {
        path: '/creator/:id',
        element: <Creator />,
        name: 'Creator',
        routeName: 'creator'
      },
      {
        path: '/search/:keyword',
        element: <SearchResult />,
        name: 'Search',
        routeName: 'search'
      }
    ]
  },
  {
    path: '/studio',
    element: <StudioLayout />,
    name: 'studio',
    children: [
      {
        path: 'dashboard',
        name: 'Home',
        element: <Dashboard />,
        routeName: 'dashboard'
      },
      {
        path: 'upload',
        name: 'Posts',
        element: <Uploads />,
        routeName: 'upload',
      },
      {
        path: 'profile',
        name: 'Profile',
        element: <Profile />,
        routeName: 'profile'
      },
      {
        path: 'following',
        name: 'Following',
        element: <Following />,
        routeName: 'following'
      },
      {
        path: 'followers',
        name: 'Followers',
        element: <Followers />,
        routeName: 'followers'
      },
      {
        path: 'collection',
        name: 'Saved',
        element: <Collection />,
        routeName: 'collection'
      },
    ]
  },
  
]
