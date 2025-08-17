import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function SanAntonio() {
  const cityData = {
    name: 'San Antonio',
    slug: 'san-antonio',
    tagline: 'Alamo City Pride',
    description: 'Honor San Antonio heritage with Alamo City apparel and River Walk designs.',
    keywords: 'San Antonio, Texas, Alamo, River Walk, Fiesta, Spurs, Historic',
    landmarks: ['The Alamo', 'River Walk', 'Pearl District', 'Market Square', 'San Antonio Missions'],
    population: '1,547,253',
    founded: '1718',
    heroImage: '/images/san-antonio-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}