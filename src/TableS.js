import React from 'react'
import "./Table.css"
function TableS({states}) {
    return(
        <div className="table">
            {states.map(({state, cases})=>(
                <tr>
                    <td>{state}
                    </td>
                    <td><strong>{cases}</strong>
                    </td>
                 </tr>

            ))}
        </div>
    );
}

export default TableS
