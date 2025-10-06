import React from 'react'
import { FaArrowUp } from "react-icons/fa";
export default function Card({ heading, totalNumber, totalGrowth, icon }) {
    return (
        <div style={{ backgroundColor: "#F1DCD1", borderRadius: 5, width: 310, height: 90, }}>
            <p style={{ color: 'black', padding: 3 }}> {heading}</p>
            <div style={{ height: 50, width: 40, backgroundColor: 'pink', borderRadius: 18, float: 'right', marginTop: -20, marginRight: 20, textAlign: 'center', backgroundColor: '#8E6652' }}>{icon}
            </div>
            <h5 style={{ fontWeight: 'bold', color: 'black', marginTop: -23, padding: 3, }}>{totalNumber} </h5>
            <h5 style={{ color: 'green', marginTop: -15, padding: 6 }}>  <FaArrowUp size={10} color="green" />  {totalGrowth}</h5>

        </div>
    )
}
