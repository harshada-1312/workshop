import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import Dashboard from './pages/Dashboard'
import AuthorList from './pages/authors/AuthorList'
import AuthorDetail from './pages/authors/AuthorDetail'
import AuthorNew from './pages/authors/AuthorNew'
import AuthorEdit from './pages/authors/AuthorEdit'
import BookList from './pages/books/BookList'
import BookDetail from './pages/books/BookDetail'
import BookNew from './pages/books/BookNew'
import BookEdit from './pages/books/BookEdit'
import CollectionList from './pages/collections/CollectionList'
import CollectionDetail from './pages/collections/CollectionDetail'
import CollectionNew from './pages/collections/CollectionNew'
import CollectionEdit from './pages/collections/CollectionEdit'
import SearchPage from './pages/search/SearchPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="authors" element={<AuthorList />} />
        <Route path="authors/new" element={<AuthorNew />} />
        <Route path="authors/:id" element={<AuthorDetail />} />
        <Route path="authors/:id/edit" element={<AuthorEdit />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/new" element={<BookNew />} />
        <Route path="books/:id" element={<BookDetail />} />
        <Route path="books/:id/edit" element={<BookEdit />} />
        <Route path="collections" element={<CollectionList />} />
        <Route path="collections/new" element={<CollectionNew />} />
        <Route path="collections/:id" element={<CollectionDetail />} />
        <Route path="collections/:id/edit" element={<CollectionEdit />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
