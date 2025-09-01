import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

const TableComponent = () => {
    const [selectedColumns, setSelectedColumns] = useState([]);

    const Calbasegrowth = [
        'Productname', 'Packsize', 'Jan', 'Feb', 'Mar', 'Apr', 
        'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const data = [
        { productname: 'SUNDAE STRAWBERRY 1*18', packsize: 18, jan: 134, feb: 180, mar: 230, apr: 264, may: 284, jun: 281, jul: 365, aug: 300, sep: 320, oct: 194, nov: 209, dec: 144 },
        { productname: 'SUNDAE VANILLA 1*18 (FNUL)', packsize: 18, jan: 155, feb: 105, mar: 242, apr: 246, may: 272, jun: 288, jul: 388, aug: 315, sep: 310, oct: 201, nov: 203, dec: 133 },
        { productname: 'SUNDAE TRIPLE CHOCOLATE 1*18', packsize: 18, jan: 173, feb: 124, mar: 289, apr: 300, may: 320, jun: 288, jul: 398, aug: 350, sep: 330, oct: 231, nov: 221, dec: 133 }
    ];

    const handleColumnCheckboxChange = (index) => {
        if (selectedColumns.includes(index)) {
            setSelectedColumns(selectedColumns.filter(i => i !== index));
        } else {
            setSelectedColumns([...selectedColumns, index]);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {Calbasegrowth.map((column, index) => (
                            <TableCell key={column}>
                                {index > 1 && ( // Display checkbox from the 2nd column onward
                                    <Checkbox
                                        checked={selectedColumns.includes(index)}
                                        onChange={() => handleColumnCheckboxChange(index)}
                                    />
                                )}
                                {column}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                            {Calbasegrowth.map((column, colIndex) => (
                                <TableCell
                                    key={`${rowIndex}-${colIndex}`}
                                    style={{
                                        backgroundColor: selectedColumns.includes(colIndex) ? '#f0f0f0' : 'white'
                                    }}
                                >
                                    {colIndex === 0 ? row.productname : colIndex === 1 ? row.packsize : row[Calbasegrowth[colIndex].toLowerCase()]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableComponent;
