import React from 'react';
import { createColumnHelper, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

const ContributionTable = () => {
  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor('basedSales', {
      header: 'Based Sales',
    }),
    columnHelper.accessor('estimateGrowth', {
      header: 'Estimate Growth Sales',
    }),
    columnHelper.accessor('incrementalProfit', {
      header: 'Incremental Profit(loss)',
      cell: info => <div style={{ backgroundColor: '#EAD1DC' }}>{info.getValue()}</div>, // สีม่วง
    }),
    columnHelper.accessor('growthPercent', {
      header: '% Growth',
      cell: info => <div style={{ backgroundColor: '#EAD1DC' }}>{info.getValue()}</div>, // สีม่วง
    }),
  ];

  const data = [
    { basedSales: 5257, estimateGrowth: 8411, incrementalProfit: 3154, growthPercent: '60%' },
    { basedSales: 4889, estimateGrowth: 6672, incrementalProfit: 1783, growthPercent: '21%' },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2>Contribution Evaluation (Baht)</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: '20px' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  style={{ border: '1px solid black', padding: '8px', backgroundColor: '#008000', color: 'white' }}
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContributionTable;
