import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function FortWorth() {
  const cityData = {
    name: 'Fort Worth',
    slug: 'fort-worth',
    tagline: 'Where the West Begins',
    description: 'Experience the authentic spirit of Fort Worth with our collection celebrating Cowtown culture, stockyards, and western heritage.',
    keywords: 'Fort Worth, Texas, Cowtown, Stockyards, Western Heritage, Where the West Begins',
    landmarks: ['Fort Worth Stockyards', 'Sundance Square', 'Cultural District', 'Trinity River', 'Billy Bob\'s Texas'],
    population: '918,915',
    founded: '1849',
    heroImage: '/images/fort-worth-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}