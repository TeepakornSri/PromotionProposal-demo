import React, { useState, useEffect ,useMemo} from 'react';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Box, Typography, CircularProgress, Modal } from '@mui/material';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LockResetIcon from '@mui/icons-material/LockReset';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import EditUser from '../components/EditUser';

export default function Showallusers() {
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeactivateUser = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/PromotionProposal/api/auth/deactivateuser/${id}`);
      if (response.status === 200) {
        setRowData(rowData.map(user => user.id === id ? { ...user, status: 'NOT_ACTIVE' } : user));
        Swal.fire({
          icon: 'success',
          title: 'User Deactivated',
          text: 'User has been deactivated successfully.',
        });
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to deactivate user.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleActivateUser = async (id) => {
    setLoading(true);
    try {
      const response = await axios.patch(`/PromotionProposal/api/auth/activateuser/${id}`);
      if (response.status === 200) {
        setRowData(rowData.map(user => user.id === id ? { ...user, status: 'ACTIVE' } : user));
        Swal.fire({
          icon: 'success',
          title: 'User Activated',
          text: 'User has been activated successfully.',
        });
      }
    } catch (error) {
      console.error('Error activating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to activate user.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (id) => {
    setLoading(true);
    try {
      // เรียก API หลังบ้านเพื่อรีเซ็ตรหัสผ่าน
      const response = await axios.patch(`/PromotionProposal/api/auth/resetuser/${id}`);

      if (response.status === 200) {

        // ดึงข้อมูลที่ได้จากหลังบ้าน
        const { userId, password, passwordRepeat, userIdSession, appId } = response.data;

        // เรียก API ภายนอกเพื่ออัปเดตรหัสผ่าน
        const externalResponse = await axios.patch(
          `https://fnulogincontrolint.fngroup.com.sg/api/password/update`,
          {
            userId,
            password,
            passwordRepeat,
            userIdSession,
            appId,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (externalResponse.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Password Reset',
            text: 'Password has been reset to P@ssword2025.',
          });
        } else {
          throw new Error('External API update failed');
        }
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to reset password.',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleEditUser = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/PromotionProposal/api/auth/getuserbyid/${id}`);
      if (response.status === 200) {
        setSelectedUser(response.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch user details.',
      });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true, filter: true, width: 80 },
    { headerName: 'User Code', field: 'usercode', sortable: true, filter: true, flex: 1 },
    { headerName: 'Role Code', field: 'role_code', sortable: true, filter: true, flex: 1 },
    { headerName: 'Name (English)', field: 'nameEng', sortable: true, filter: true, flex: 1 },
    { headerName: 'Name (Thai)', field: 'nameThai', sortable: true, filter: true, flex: 1 },
    { headerName: 'Contact Email', field: 'Contact_Email', sortable: true, filter: true, flex: 1 },
    { headerName: 'Created At', field: 'createdAt', sortable: true, filter: true, flex: 1 },
    { headerName: 'Modify Date', field: 'modifyDate', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: (params) => (
        <span className={`font-bold ${params.value === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
          {params.value}
        </span>
      ),
      sortable: true,
      filter: true,
      flex: 1
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <div className="flex justify-center items-center gap-2">
          {params.data.status === 'ACTIVE' ? (
            <div
              onClick={() => handleDeactivateUser(params.data.id)}
              className="cursor-pointer text-red-500 hover:text-red-300 hover:scale-125 transition-transform"
            >
              <PersonRemoveIcon />
            </div>
          ) : (
            <div
              onClick={() => handleActivateUser(params.data.id)}
              className="cursor-pointer text-green-500 hover:text-green-300 hover:scale-125 transition-transform"
            >
              <GroupAddIcon />
            </div>
          )}
          <div
            onClick={() => handleResetPassword(params.data.id)}
            className="cursor-pointer text-orange-500 hover:text-orange-300 hover:scale-125 transition-transform"
          >
            <LockResetIcon />
          </div>
          <div
            onClick={() => handleEditUser(params.data.id)}
            className="cursor-pointer text-blue-500 hover:text-blue-300 hover:scale-125 transition-transform"
          >
            <EditIcon />
          </div>
        </div>
      ),
      flex: 1
    }

  ];

  const gridOptions = useMemo(
    () => ({
      defaultColDef: {
        resizable: false,
        sortable: true,
        filter: true,
      },
      suppressMovableColumns: true,
      rowHeight: 60,
    }),
    []
  );


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/PromotionProposal/api/auth/getallusers');
        setRowData(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="relative">
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <CircularProgress />
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded shadow-lg h-5/6 w-1/2 overflow-y-auto">
          {selectedUser && <EditUser user={selectedUser} />}
        </div>
      </Modal>

      <div className="m-6">
        <Typography variant="h4" gutterBottom>
          All Users
        </Typography>
        <div className="ag-theme-alpine h-[500px] w-full pb-6">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            gridOptions={gridOptions}
          />
        </div>
      </div>


      {/* <div className="flex w-full justify-start bg-gray-100 h-full p-4 shadow-2xl rounded-xl">
        <div className="ag-theme-alpine w-full h-full" style={{ overflowX: 'auto' }}>
          <div className="ag-theme-alpine h-full md:h-[500px] w-[530px] md:w-full overflow-y-auto shadow-2xl">
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              gridOptions={gridOptions}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
