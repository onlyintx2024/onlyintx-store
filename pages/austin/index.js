import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function Austin() {
  const cityData = {
    name: 'Austin',
    slug: 'austin',
    tagline: 'Keep Austin Weird',
    description: 'Discover authentic Austin pride with our unique collection celebrating the Live Music Capital of the World.',
    keywords: 'Austin, Texas, Keep Austin Weird, Live Music, Music Capital, Downtown Austin',
    landmarks: ['State Capitol', 'Music Venues', 'Sixth Street', 'Lake Travis', 'Zilker Park'],
    population: '965,872',
    founded: '1839',
    heroImage: '/images/austin-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}