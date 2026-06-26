import { useState, useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import TopNav from '../components/nav/TopNav'
import BottomNav from '../components/nav/BottomNav'
import Drawer from '../components/nav/Drawer'

export default function UserLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { pathname } = useLocation()

  // 라우트 변경 시 scroll-to-top + drawer 닫기
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setDrawerOpen(false)
  }, [pathname])

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ minHeight: '100vh', background: '#fff', position: 'relative' }}>

        <TopNav onMenuOpen={() => setDrawerOpen(true)} />

        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

        {/* 각 페이지 마지막 섹션이 하단 여백을 직접 관리 (inline style이 md: 클래스를 덮어쓰는 문제 방지) */}
        <main>
          <Outlet />
        </main>

        <BottomNav />

      </div>
    </div>
  )
}
