import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function Dallas() {
  const cityData = {
    name: 'Dallas',
    slug: 'dallas',
    tagline: 'Big D Energy',
    description: 'Show your Dallas pride with premium apparel celebrating the heart of North Texas.',
    keywords: 'Dallas, Texas, Big D, Cowboys, Mavericks, Deep Ellum, Downtown Dallas',
    landmarks: ['Reunion Tower', 'AT&T Stadium', 'Deep Ellum', 'Dallas Arboretum', 'Fair Park'],
    population: '1,343,573',
    founded: '1841',
    heroImage: '/images/dallas-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}