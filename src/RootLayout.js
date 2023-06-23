import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from './components/header/Header';
import Footer from './components/footer/Footer'

function RootLayout() {
  return (
    <div>
        <Header />
        <div className="container" style={{minHeight:'80vh'}}>
            <Outlet />
        </div>
        <Footer />
    </div>
  )
}

export default RootLayout