import React from 'react'

function Box(props) {
    return (
        <div>
            <ul style={{ display: "flex", gap: '20px', marginLeft: '-30px', marginTop: -20 }}>
                <button id="Box" style={{ fontWeight: 'bold', height: 40, width: 100, color: '#8E6652', marginTop: 10 }}>
                    {props.hd1}
                </button>
            </ul>
        </div>
    )
}

export default Box
