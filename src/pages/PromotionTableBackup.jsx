import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react'; 
import 'ag-grid-community/styles/ag-grid.css'; 
import 'ag-grid-community/styles/ag-theme-alpine.css'; 
import '../styles.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import { Backdrop, CircularProgress } from '@mui/material'; 
import { useAuth } from '../hooks/use-auth'
import { MdEmail } from "react-icons/md";


export default function PromotionTable() {
  const [pageSize, setPageSize] = useState(100);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStep, setSelectedStep] = useState('');
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const gridApi = useRef(null);
  const { authUser } = useAuth();

  const currentDate = new Date().toISOString().split('T')[0];

  const steps = [
    'APPROVED',
    'REJECT',
    'RETURN',
    'Waiting For Approved_Step2',
    'Waiting For FIN',
    'Waiting For CHANNELDEV',
    'Waiting For Approved_Step4',
    'Waiting For GM'
  ];

  // ฟังก์ชันคำนวณการกรองข้อมูลตามวันที่และ step
  const filterData = useCallback((data) => {
    const currentDate = new Date();
    let start = startDate ? new Date(startDate) : new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000); // Default 30 days before
    let end = endDate ? new Date(endDate) : currentDate;

    // ตั้งเวลาเริ่มต้นและสิ้นสุด
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    let filtered = data.filter((item) => {
      const itemDate = new Date(item.requestDate); // ใช้ requestDate ในการกรองวันที่
      return itemDate >= start && itemDate <= end;
    });

    // กรองข้อมูลตาม step ที่เลือก
    if (selectedStep) {
      filtered = filtered.filter((item) => item.step === selectedStep);
    }

    setFilteredData(filtered);

    if (gridApi.current) {
      gridApi.current.setRowData(filtered);
    }
  }, [startDate, endDate, selectedStep]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/PromotionProposal/api/promotion/getAllpromotion');
        const data = response.data.data;
  
        if (Array.isArray(data)) {
          let filteredData = data;
  
          if (!['Approved_Step2', 'Approved_Step1', 'Approved_Step3', 'Approved_Step4', 'GM'].includes(authUser.role_code) && authUser.role_code !== 'ADMIN') {
            filteredData = data.filter(row => row.createdBy === authUser.usercode);
          }
  
          setRowData(filteredData);
          filterData(filteredData); // กรองข้อมูลหลังจากโหลด
        } else {
          console.warn("Data is not an array:", data);
          setRowData([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRowData([]);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, [authUser.usercode, authUser.role_code, authUser.role_code, filterData]); 
  
  // ฟังก์ชันจัดการเมื่อเปลี่ยนวันที่
  const handleDateChange = (dateType, value) => {
    if (value > currentDate) {
      value = currentDate;
    }

    if (dateType === 'start') {
      if (!endDate || value <= endDate) {
        setStartDate(value);
      } else {
        setStartDate(endDate);
      }
    } else {
      if (!startDate || value >= startDate) {
        setEndDate(value);
      } else {
        setEndDate(startDate);
      }
    }
  };

  // ฟังก์ชันจัดการเมื่อเปลี่ยนค่า step ที่เลือก
  const handleStepChange = (e) => {
    setSelectedStep(e.target.value);
  };

  const gridOptions = useMemo(
    () => ({
      defaultColDef: {
        resizable: false,
        sortable: false,
        filter: false,
      },
      pagination: true,
      paginationPageSize: 10, 
      paginationPageSizeSelector: [10, 20, 50], 
      rowHeight: 60,
      suppressMovableColumns: true,
    }),
    []
  );
  
  const onGridReady = useCallback((params) => {
    gridApi.current = params.api;
    gridApi.current.updateGridOptions({ paginationPageSize: pageSize });
  }, [pageSize]);

  const onFilterTextBoxChanged = useCallback(() => {
    const filterText = document.getElementById('filter-text-box').value;
    gridApi.current?.setQuickFilter(filterText); 
  }, []);

  const handleViewOpen = (content) => {
    const { documentNumber } = content;
    if (documentNumber) {
      navigate(`/PromotionProposal/viewdetail/${documentNumber}`);
      console.log(documentNumber)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'ไม่พบข้อมูลที่จำเป็น',
      });
    }
  };

  const handleEditOpen = (content) => {
    const { documentNumber } = content;
    if (documentNumber) {
      navigate(`/PromotionProposal/edit/${documentNumber}`);
      console.log(documentNumber)
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'ไม่พบข้อมูลที่จำเป็น',
      });
    }
  };

const handleResendEmail = async (documentNumber) => {
  setLoading(true); // เริ่มการแสดง loading
    try {
      const response = await axios.post(`/PromotionProposal/api/promotion/promotion/${documentNumber}/resend-email`);
      Swal.fire('สำเร็จ', 'อีเมลถูกส่งซ้ำเรียบร้อย', 'success');
    } catch (error) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถส่งอีเมลซ้ำได้', 'error');
    } finally {
      setLoading(false); // หยุดการแสดง loading
    }
  };
  const columns = [
    { 
      headerName: 'Promotion No', 
      field: 'documentNumber',
      sort: 'desc',
      flex: 1, 
      cellStyle: { justifyContent: 'start', display: 'flex', alignItems: 'center' }
    },
    { 
      headerName: 'Customer Code', 
      field: 'customerCode', 
      flex: 1, 
      cellStyle: { justifyContent: 'start', display: 'flex', alignItems: 'center' }
    },
    { 
      headerName: 'Customer Name', 
      field: 'customer.companyName', 
      flex: 1, 
      valueGetter: (params) => params.data.customer ? params.data.customer.companyName : '', 
      cellStyle: { justifyContent: 'start', display: 'flex', alignItems: 'center' }
    },
    { 
      headerName: 'Promotion Title', 
      field: 'promotionTitle', 
      flex: 1, 
      cellStyle: { justifyContent: 'start', display: 'flex', alignItems: 'center' }
    },
    { 
      headerName: 'Promotion Type', 
      field: 'promotionType', 
      flex: 1, 
      cellStyle: { justifyContent: 'start', display: 'flex', alignItems: 'center' }
    },
    {
      headerName: 'Request Date',
      field: 'requestDate',
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${day}/${month}/${year}`;
      },
      cellStyle: { justifyContent: 'start', display: 'flex', alignItems: 'center' }
    },
    {
      headerName: 'Step', 
      field: 'step', 
      flex: 1, 
      cellStyle: params => {
        switch (params.value) {
          case 'RETURN':
            return { color: 'orange', justifyContent: 'start', display: 'flex', alignItems: 'center' };
          case 'REJECT':
            return { color: 'red', justifyContent: 'start', display: 'flex', alignItems: 'center' };
          case 'APPROVED':
            return { color: 'green', justifyContent: 'start', display: 'flex', alignItems: 'center' };
          default:
            return { color: 'blue', justifyContent: 'start', display: 'flex', alignItems: 'center' };
        }
      }
    },
    {
      field: 'action',
      headerName: '',
      width:60,
      cellRenderer: params => (
        <div
          onClick={() => handleViewOpen(params.data)}
          className="flex justify-center items-center cursor-pointer hover:text-blue-500 transition-colors duration-200"
        >
          <FaMagnifyingGlass size={25} /> 
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    },
    {
      field: 'action',
      headerName: '',
      width: 60,
      cellRenderer: params => {
        if (params.data.step = 'RETURN') {
          return (
            <div
              onClick={() => handleEditOpen(params.data)}
              className="flex justify-center items-center cursor-pointer hover:text-blue-500 transition-colors duration-200"
            >
              <MdEdit size={25} />
            </div>
          );
        }
        return null;
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    },
    {
      field: 'action',
      headerName: '',
      width: 60,
      cellRenderer: params => {
        if (authUser.role_code === 'ADMIN' && params.data.step !== 'RETURN') {
          return (
            <div
              onClick={() => handleResendEmail(params.data.documentNumber)}
              className="flex justify-center items-center cursor-pointer hover:text-blue-500 transition-colors duration-200"
            >
              <MdEmail size={25} />
            </div>
          );
        }
        return null;
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    },
   
  ];
  
  return (
    <div className="ag-theme-alpine w-full h-full flex flex-col rounded-md shadow-2xl items-center mt-16">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!loading && (
        <>
        <div className='flex w-full justify-start '>
        <div className="flex flex-row justify-start items-center pb-2 pt-2 sticky top-0 z-10 gap-12 w-full p-2">
            <input
              type="text"
              id="filter-text-box"
              placeholder="ค้นหา..."
              onInput={onFilterTextBoxChanged}
              className="border border-stone-200 p-4 rounded-lg md:w-96 w-80 shadow-2xl"
            />
          </div>

          <div className="flex gap-4 p-4">
            <div className="flex flex-col">
              <label className="text-blue-500">วันที่เริ่มต้น:</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange('start', e.target.value)}
                max={endDate || currentDate}
                className="border h-8 w-36 rounded-lg focus:border-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-blue-500">ถึงวันที่:</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange('end', e.target.value)}
                min={startDate}
                max={currentDate}
                className="border h-8 w-36 rounded-lg focus:border-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-blue-500">เลือก Step:</label>
              <select
                value={selectedStep}
                onChange={handleStepChange}
                className="border h-8 w-36 rounded-lg focus:border-blue-500 cursor-pointer"
              >
                <option value="">Step ทั้งหมด</option>
                {steps.map((step) => (
                  <option key={step} value={step}>
                    {step}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
          
          <div className='w-full' style={{ height: '75%' }}>
            <AgGridReact
              rowData={filteredData} 
              columnDefs={columns}
              gridOptions={gridOptions}
              paginationPageSize={pageSize}
              pagination={true}
              onGridReady={onGridReady}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </>
      )}
    </div>
  );
}
