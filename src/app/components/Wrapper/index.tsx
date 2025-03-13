import React from 'react'
import Header from '../Header'
import Footer from '../Footer'

interface WrapperProps {
    children: React.ReactNode
  }

const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
        <Header />
        {children}
        <Footer />
    </div>
  )
}

export default Wrapper