import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function Houston() {
  const cityData = {
    name: 'Houston',
    slug: 'houston',
    tagline: 'Space City Style',
    description: 'Celebrate Houston with authentic Space City apparel and Houston Astros gear.',
    keywords: 'Houston, Texas, Space City, NASA, Astros, Rockets, Museum District',
    landmarks: ['Space Center Houston', 'Museum District', 'The Galleria', 'Buffalo Bayou', 'Minute Maid Park'],
    population: '2,304,580',
    founded: '1836',
    heroImage: '/images/houston-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}