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
import Modal from '@mui/material/Modal';
import { Backdrop, CircularProgress } from '@mui/material'; 
import { useAuth } from '../hooks/use-auth';
import { MdEmail } from "react-icons/md";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import zIndex from '@mui/material/styles/zIndex';
import { FaFileSignature } from "react-icons/fa";
import { MdCancel } from "react-icons/md"; // Import Icon สำหรับ Cancel Button

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'white',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
  zIndex: 9999, // กำหนด zIndex ให้สูงที่สุด
};

export default function PromotionTable() {
  const [pageSize, setPageSize] = useState(100);
  const [rowData, setRowData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedStep, setSelectedStep] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null); 
  const navigate = useNavigate();
  const gridApi = useRef(null);
  const { authUser } = useAuth();
  const [commentStep1, setModernTardecomment] = useState('');
  const [commentStep2, setTmkcomment] = useState('');
  const [commentStep3, setChanneldevcomment] = useState('');
  const [commentStep4, setHodcomment] = useState('');
  const [commentStep5, setGmcomment] = useState('');

  const currentDate = new Date().toISOString().split('T')[0];

  const steps = [
    'APPROVED',
    'REJECT',
    'RETURN',
    'Waiting For Approved_Step1',
    'Waiting For Approved_Step2',
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

    // กรองสถานะให้ไม่รวม CANCELLED และตรวจสอบวันที่
    let filtered = data.filter((item) => {
        const itemDate = new Date(item.requestDate);
        return itemDate >= start && itemDate <= end && item.Status !== 'CANCELLED'; // กรอง Status เป็น CANCELLED
    });


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

  const handleCommentChange = (e) => {
    const value = e.target.value;
    switch (authUser.role_code) {
      case 'Approved_Step1':
        setModernTardecomment(value);
        break;
      case 'Approved_Step2':
        setTmkcomment(value);
        break;
      case 'Approved_Step3':
        setChanneldevcomment(value);
        break;
      case 'Approved_Step4':
        setHodcomment(value);
        break;
      case 'GM':
        setGmcomment(value);
        break;
      default:
        break;
    }
  };

  const getCommentValue = () => {
    switch (authUser.role_code) {
      case 'Approved_Step1':
        return commentStep1;
      case 'Approved_Step2':
        return commentStep2;
      case 'Approved_Step3':
        return commentStep3;
      case 'Approved_Step4':
        return commentStep4;
      case 'GM':
        return commentStep5;
      default:
        return '';
    }
  };

  const handleApproval = async (action) => {
    const promotionId = selectedJobId; // ใช้ selectedJobId จาก Modal
    setLoading(true);
    
    try {
      const requestBody = {
        action,
        commentStep1,  // ส่งค่าคอมเมนต์ไปยัง backend
        commentStep2,
        commentStep3,
        commentStep4,
        commentStep5,
      };
      
      const response = await axios.patch(`/PromotionProposal/api/promotion/approve/${promotionId}/${action}`, requestBody);
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: `การ ${action === 'approve' ? 'อนุมัติ' : 'ส่งกลับ'} เสร็จสิ้น`,
        }).then(() => {
          handleModalClose(); // ปิด Modal เมื่อการ approve สำเร็จ
          window.location.reload(); // ทำการรีเฟรชหน้าจอ
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถดำเนินการได้',
      });
      console.error('Error handling approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (documentNumber) => {
    Swal.fire({
      title: 'ยืนยันการยกเลิก',
      text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกโปรโมชั่นนี้?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          const response = await axios.patch(`/PromotionProposal/api/promotion/promotion/${documentNumber}/cancel`, {
            role_code: authUser.role_code
          });
          if (response.status === 200) {
            Swal.fire('สำเร็จ', 'โปรโมชั่นถูกยกเลิกเรียบร้อย', 'success').then(() => {
              window.location.reload(); // รีเฟรชหน้า
            });
          }
        } catch (error) {
          Swal.fire('ผิดพลาด', 'ไม่สามารถยกเลิกโปรโมชั่นได้', 'error');
          console.error('Error cancelling promotion:', error);
        } finally {
          setLoading(false);
        }
      }
    });
  };
  


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

  const handleStepChange = (e) => {
    setSelectedStep(e.target.value);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedJobId(null); // Reset Job ID
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
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'ไม่พบข้อมูลที่จำเป็น',
      });
    }
  };

  const handleResendEmail = async (documentNumber) => {
    setLoading(true); 
    try {
      const response = await axios.post(`/PromotionProposal/api/promotion/promotion/${documentNumber}/resend-email`);
      Swal.fire('สำเร็จ', 'อีเมลถูกส่งซ้ำเรียบร้อย', 'success');
    } catch (error) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถส่งอีเมลซ้ำได้', 'error');
    } finally {
      setLoading(false); 
    }
  };

  const handleOpenModal = (jobId) => {
    setSelectedJobId(jobId);
    setModalOpen(true);
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
      headerName: 'Promotion Period', 
      field: 'startDate', 
      flex: 1,
      valueGetter: (params) => {
        if (!params.data.startDate || !params.data.endDate) return '';
        
        // ดึงค่า startDate และ endDate
        const startDate = new Date(params.data.startDate);
        const endDate = new Date(params.data.endDate);
        
        // ฟอร์แมตวันที่เป็น YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // ส่งกลับในรูปแบบ startDate - endDate
        return `${formattedStartDate} ถึง ${formattedEndDate}`;
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
      width: 60,
      cellRenderer: params => {
        const { role_code } = authUser;
        const { step } = params.data;
    
        // เพิ่มเงื่อนไขสำหรับ role 'ADMIN' และ 'Approved_Step2'
        if ((role_code === 'Approved_Step4' && step === 'Waiting For Approved_Step4') || 
            (role_code === 'GM' && step === 'Waiting For GM') ||
            role_code === 'ADMIN' || 
            role_code === 'Approved_Step2') {
          return (
            <div
              onClick={() => handleOpenModal(params.data.documentNumber)}
              className="flex justify-center items-center cursor-pointer hover:text-blue-500 transition-colors duration-200"
            >
              <FaFileSignature size={25} />
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
        if (params.data.step === 'RETURN' && authUser.usercode === params.data.createdBy) {
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
        if (authUser.role_code === 'ADMIN' || authUser.role_code === 'Approved_Step2' && params.data.step !== 'RETURN') {
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
    {
      field: 'action',
      headerName: '',
      width: 60,
      cellRenderer: params => {
        if (authUser.role_code === 'ADMIN' || authUser.role_code === 'Approved_Step2' ) {
          return (
            <div
              onClick={() => handleCancel(params.data.documentNumber)}
              className="flex justify-center items-center cursor-pointer hover:text-red-300 transition-colors duration-200 text-red-500"
            >
              <MdCancel size={25} />
            </div>
          );
        }
        return null;
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    }
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
          <div className='flex w-full justify-start'>
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

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { zIndex: 9998 },
        }}
        style={{ zIndex: 9999 }}
      >
        <Fade in={modalOpen}>
          <Box sx={style} className="rounded-lg shadow-lg p-6 relative">
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <Typography id="modal-title" variant="h5" component="h2" className="text-blue-500 mb-4">
              Review By {authUser.role_code}
            </Typography>
            <Box>
              <Typography variant="body1" gutterBottom>
                Job ID: {selectedJobId}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Date: {new Date().toLocaleString()}
              </Typography>
              <textarea
                rows={3}
                className="w-full border p-2 rounded-md"
                placeholder="Comment"
                value={getCommentValue()}
                onChange={handleCommentChange}
                disabled={loading}
              />
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={() => handleApproval('approve')} disabled={loading}>
                  Approve
                </button>
                <button className="px-4 py-2 bg-orange-400 text-white rounded-md" onClick={() => handleApproval('return')} disabled={loading}>
                  Return
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => handleApproval('reject')} disabled={loading}>
                  Reject
                </button>
              </div>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
