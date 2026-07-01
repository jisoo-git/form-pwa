import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../lib/analytics'

// BrowserRouter 안에 렌더되어 모든 라우트(사용자·관리자·로그인) 변경 시
// GA4 page_view 를 정확한 경로·제목으로 전송한다. 화면에는 아무것도 그리지 않는다.
export default function RouteTracker() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    trackPageView(pathname, search)
  }, [pathname, search])

  return null
}
