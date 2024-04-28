import React from 'react'

const Footer = () => {

  const currentYear = () => {
    const date = new Date()
    const year = date.getFullYear()
    return year
  }

  return (
    <div>
      <br /><br />
      <div className='text-center footer'>
        ECart - @Copyright - {`${currentYear()}`}
      </div>
    </div>
  )
}

export default Footer