import React from 'react'
import { Link } from 'react-router-dom'
function Buttons(props) {
  return (
    <ul>
      <button id='Dashboard' style={{width:190,marginLeft: -10, }}>
        <Link style={{fontWeight: 'bold', display: "flex", width: 200, color: 'white', marginLeft: -10, gap: 6,alignItems:'center' }} to={props.url}>
          {props.icon}
          {props.button}
        </Link>
      </button>
    </ul>

  )
}

export default Buttons
