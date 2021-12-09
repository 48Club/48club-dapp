import React from 'react'
import './index.less'

export default function CustomerSection (){
    return (
      <div className='introduction-section'>
        <div className='container'>
          <div className='section-header'>
            <div className='section-logo'>
              <img src='/static/logo-koge-01.png' alt='Koge' />
            </div>
            <div className='section-title'>
              {'home_page_introduction_section_title'}
            </div>
            <div className='section-subtitle'>
              {'home_page_introduction_section_subtitle'}
            </div>
          </div>
        </div>
      </div>
    )
}
