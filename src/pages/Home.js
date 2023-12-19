import Announcements from '../components/Announcements'
import React from 'react'
import Navbar from '../components/Navbar'
import Slider from '../components/Slider'
import Categories from '../components/Categories'
import Products from '../components/Products'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Announcements/>
        <Navbar/>
        <Categories/>
        <Slider/>
        <Products/>
        <Newsletter/>
        <Footer/>
    </div>
  )
}

export default Home