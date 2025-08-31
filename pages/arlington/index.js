import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function Arlington() {
  const cityData = {
    name: 'Arlington',
    slug: 'arlington',
    tagline: 'The American Dream City',
    description: 'Experience Arlington\'s sports and entertainment culture with our collection celebrating home to the Cowboys, Rangers, and Six Flags thrills.',
    keywords: 'Arlington, Texas, American Dream City, Cowboys, Rangers, Six Flags, Sports Entertainment',
    landmarks: ['AT&T Stadium', 'Globe Life Field', 'Six Flags Over Texas', 'Arlington Stadium', 'International Bowling Museum'],
    population: '394,266',
    founded: '1876',
    heroImage: '/images/arlington-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}