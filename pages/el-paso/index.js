import Layout from '../../components/Layout'
import CityPage from '../../components/CityPage'

export default function ElPaso() {
  const cityData = {
    name: 'El Paso',
    slug: 'el-paso',
    tagline: 'The Sun City',
    description: 'Celebrate the unique border culture of El Paso with our collection honoring the Sun City\'s rich Mexican-American heritage and mountain desert beauty.',
    keywords: 'El Paso, Texas, Sun City, Border Culture, Mexican-American Heritage, Franklin Mountains',
    landmarks: ['Franklin Mountains', 'Plaza Theatre', 'El Paso Museum of Art', 'Hueco Tanks', 'Mission Trail'],
    population: '678,815',
    founded: '1873',
    heroImage: '/images/el-paso-hero.jpg'
  }
  
  return (
    <Layout>
      <CityPage city={cityData} />
    </Layout>
  )
}