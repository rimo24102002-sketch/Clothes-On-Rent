import React from 'react'
export default function Card({ heading, totalNumber, totalGrowth, icon }) {
    return (
        <div style={{ backgroundColor: "#F1DCD1", borderRadius: 5, marginBottom: "8px", width: 250, height: 90, marginLeft: "13px" }}>
            <span style={{ color: 'black', padding: 7, fontSize: 14, bottom: '10px' }}>{heading}</span>
            <h5 style={{ fontWeight: 'bold', color: 'black', marginBottom: "8px", padding: 7 }}>{totalNumber} </h5>
            <span style={{ color: 'green', padding: 3, fontSize: 12, position: 'relative', bottom: '20px' }}>{totalGrowth}</span>
        </div>
    )
}
