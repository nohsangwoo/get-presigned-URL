import React from 'react'
import { Helmet } from 'react-helmet-async'

const PageTitle = ({ title, children }) => {
  return (
    <div className="application">
      <Helmet>
        <title>{title}</title>
        {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
      </Helmet>
    </div>
  )
}

export default PageTitle
