// 블로그 포스트 초기 조회수 설정
const PROJECT = 'form-pwa-academy'
const API_KEY = 'AIzaSyDDhhH_m7c0d4ZBwb18_fjQzBwFqQOb7N4'
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`

const INITIAL_VIEWS = [
  { title: '디미고 일반전형 vs 특별전형, 나에게 유리한 커트라인 전략은?', views: 257 },
  { title: '디미고 합격 커트라인, B 몇 개까지 가능할까?', views: 452 },
  { title: '26 디미고 합격 후기, 인코딩 샘들의 피드백이 가장 도움이 되었어요', views: 409 },
  { title: '2026학년도 디미고 합격 현황 및 입시 분석', views: 856 },
]

// 전체 blogPosts 조회
const res = await fetch(`${BASE}/blogPosts?key=${API_KEY}`)
const data = await res.json()
const docs = data.documents ?? []

for (const { title, views } of INITIAL_VIEWS) {
  const doc = docs.find(d => d.fields?.title?.stringValue === title)
  if (!doc) { console.log(`❌ 찾을 수 없음: ${title}`); continue }

  const docId = doc.name.split('/').pop()
  const patchRes = await fetch(
    `${BASE}/blogPosts/${docId}?updateMask.fieldPaths=views&key=${API_KEY}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { views: { integerValue: String(views) } } }),
    }
  )
  if (patchRes.ok) {
    console.log(`✅ ${views}회 설정: ${title}`)
  } else {
    console.log(`❌ 실패: ${title}`, await patchRes.text())
  }
}
