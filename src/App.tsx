import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

import Home from './pages/Home'
import Courses from './pages/Courses'
import Apply from './pages/Apply'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

import AdminSubmissions from './pages/admin/AdminSubmissions'
import AdminFormList from './pages/admin/AdminFormList'
import FormBuilder from './pages/admin/FormBuilder'
import AdminBanners from './pages/admin/AdminBanners'
import AdminBlogList from './pages/admin/AdminBlogList'
import AdminBlogWrite from './pages/admin/AdminBlogWrite'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 사용자 라우트 */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Route>

        {/* 관리자 라우트 */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/submissions" replace />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/builder" element={<AdminFormList />} />
          <Route path="/admin/builder/:id" element={<FormBuilder />} />
          <Route path="/admin/banners" element={<AdminBanners />} />
          <Route path="/admin/blog" element={<AdminBlogList />} />
          <Route path="/admin/blog/new" element={<AdminBlogWrite />} />
          <Route path="/admin/blog/:id" element={<AdminBlogWrite />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
