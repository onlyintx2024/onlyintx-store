import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function CorpusChristi() {
  const cityData = {
    name: 'Corpus Christi',
    slug: 'corpus-christi',
    tagline: 'The Sparkling City by the Sea',
    description: 'Dive into coastal Texas culture with our Corpus Christi collection celebrating beaches, bay life, and the laid-back Gulf Coast spirit.',
    keywords: 'Corpus Christi, Texas, Sparkling City by the Sea, Gulf Coast, Beaches, Bay Life, Coastal Culture',
    landmarks: ['Corpus Christi Bay', 'USS Lexington', 'Texas State Aquarium', 'Padre Island', 'Downtown Marina'],
    population: '317,863',
    founded: '1839',
    heroImage: '/images/corpus-christi-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}