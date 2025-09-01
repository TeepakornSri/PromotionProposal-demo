import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import Loading from './Loading';

const ApproveReject = () => {
  const { promotionId, action } = useParams();
  console.log('Promotion ID:', promotionId);
  const [message, setMessage] = useState('กำลังดำเนินการ...');
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const performAction = async () => {
      try {
        const response = await axios.get(`/PromotionProposal/api/promotion/approve/${promotionId}/${action}`);
        if (response.status === 200) {
          if (action === 'approve') {
            setMessage('APPROVED');
          } else if (action === 'reject') {
            setMessage('REJECTED');
          }
        } else {
          setMessage('เกิดข้อผิดพลาดในการดำเนินการ');
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setMessage(error.response.data.message);
        } else if (error.response && error.response.status === 404) {
          setMessage('ไม่พบเอกสารหรือผู้รับที่ระบุ');
        } else if (error.response && error.response.status === 403) {
          setMessage('คุณไม่มีสิทธิ์ในการดำเนินการนี้');
        } else {
          setMessage('เกิดข้อผิดพลาดในการดำเนินการ');
        }
      } finally {
        setLoading(false);
      }
    };

    performAction();
  }, [promotionId, action]);

  useEffect(() => {
    if (!loading && message !== 'กำลังดำเนินการ...') {
      let icon = 'success';
      let title = '';

      if (message === 'APPROVED') {
        title = 'อนุมัติเรียบร้อย';
      } else if (message === 'REJECTED') {
        title = 'ปฏิเสธเรียบร้อย';
        icon = 'error';
      } else if (message === 'การดำเนินการนี้ได้เสร็จสมบูรณ์แล้ว') {
        title = 'การดำเนินการนี้ได้เสร็จสมบูรณ์แล้ว';
        icon = 'info';
      } else if (message === 'ไม่พบเอกสารหรือผู้รับที่ระบุ') {
        title = 'ไม่พบเอกสารหรือผู้รับที่ระบุ';
        icon = 'error';
      } else if (message === 'คุณไม่มีสิทธิ์ในการดำเนินการนี้') {
        title = 'คุณไม่มีสิทธิ์ในการดำเนินการนี้';
        icon = 'error';
      } else {
        title = message; 
        icon = 'error';
      }

      Swal.fire({
        position: 'center',
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 3000
      }).then(() => {
        setShowContent(true);
      });
    }
  }, [loading, message]);

  return (
    <div className='flex justify-center items-center h-screen w-full'>
      {loading ? (
        <Loading />
      ) : (
        showContent && (
          <div>
            <h1 className='font-extrabold text-4xl'>ดำเนินการเรียบร้อยสามารถปิดหน้าต่างนี้ได้</h1>
          </div>
        )
      )}
    </div>
  );
};

export default ApproveReject;
