import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from '../config/axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/use-auth';
import { useNavigate, useParams } from 'react-router-dom';
import { usePromo } from '../hooks/use-promo';
import '../styles.css';
import Divider from '@mui/material/Divider';
import { Backdrop, CircularProgress } from '@mui/material'
import { useLocation } from 'react-router-dom';




export default function PrintViewDetail() {
const location = useLocation();
  const isPrintMode = location.state?.isPrintMode || false;
  const printData = location.state?.printData || {};
  const { documentNumber } = useParams();
  const [channel, setChannel] = useState(''); 
  const [totalDays, setTotalDays] = useState('');
  const [showPromotionCalGrid, setshowPromotionCalGrid] = useState(true);
  const { authUser } = useAuth();
  const [persistentTotals, setPersistentTotals] = useState(null);
  const { rowData, fetchPromotionDetails, promotion, customer, promotionDetails, proposals, isLoading} = usePromo();

  const [commentStep1, setModernTardecomment] = useState('');
  const [commentStep2, setTmkcomment] = useState('');
  const [commentStep3, setChanneldevcomment] = useState('');
  const [commentStep4, setHodcomment] = useState('');
  const [commentStep5, setGmcomment] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { showProfitAndLoss } = printData;
  useEffect(() => {
    if (isPrintMode && !isLoading && rowData.length > 0) {
      // รอจนกว่าข้อมูลจะถูกโหลดครบ และมี rowData พร้อมที่จะพิมพ์
      const printTimeout = setTimeout(() => {
        window.print();
      }, 500); // ดีเลย์ 500ms เพื่อให้หน้ามีเวลาโหลดเสร็จสมบูรณ์
  
      // เมื่อปริ้นสำเร็จหรือยกเลิกการปริ้น
      window.onafterprint = () => {
        navigate('/PromotionProposal'); // navigate ไปที่ /PromotionProposal หลังจากปริ้นสำเร็จ
      };
  
      return () => {
        clearTimeout(printTimeout); // เคลียร์ timeout ถ้าหาก component ถูก unmount
        window.onafterprint = null; // ลบ onafterprint เมื่อ component ถูก unmount เพื่อป้องกันปัญหา
      };
    }
  }, [isPrintMode, isLoading, rowData, navigate]);
  



  const handlePrint = () => {
    window.print();
  };

  const handleReturnHome = () => {
    navigate('/PromotionProposal/');
  };

  const handleApproval = async (action) => {
    const promotionId = promotion.documentNumber;
    setLoading(true);
  
    try {
      const requestBody = {
        action,
        ...(commentStep1 && { commentStep1 }),
        ...(commentStep2 && { commentStep2 }),
        ...(commentStep3 && { commentStep3 }),
        ...(commentStep4 && { commentStep4 }),
        ...(commentStep5 && { commentStep5 }),
      };
  
  
      const response = await axios.patch(`/PromotionProposal/api/promotion/approve/${promotionId}/${action}`, requestBody);
  
      if (response.status === 200) {
        Swal.fire({
          icon: 'success',
          title: 'สำเร็จ',
          text: `การ ${action === 'approve' ? 'อนุมัติ' : 'ส่งกลับ'} เสร็จสิ้น`,
        }).then(() => {
          navigate('/PromotionProposal/success');
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
  
  

  const formatNumber = (value, isPercent = false) => {
    if (value === undefined || value === null) return undefined;
    // ใช้ Intl.NumberFormat เพื่อแบ่งตัวเลขด้วย ,
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(value));
    // เพิ่ม % หาก isPercent เป็น true
    return isPercent ? formattedNumber + '%' : formattedNumber;
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const calculateTotalDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // คำนวณจำนวนวัน
    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // บวก 1 เพื่อให้รวมวันเริ่มต้นด้วย
  
    return diffDays;
  };
  


  useEffect(() => {
    // รีเซ็ตหรือดึงค่าใหม่ให้กับคอมเมนต์ต่าง ๆ
    if (!promotion?.commentStep1) {
      setModernTardecomment(''); // รีเซ็ต commentStep1
    } else {
      setModernTardecomment(promotion.commentStep1); // ดึงค่าใหม่
    }
  
    if (!promotion?.commentStep2) {
      setTmkcomment(''); // รีเซ็ต commentStep2
    } else {
      setTmkcomment(promotion.commentStep2); // ดึงค่าใหม่
    }
  
    if (!promotion?.commentStep3) {
      setChanneldevcomment(''); // รีเซ็ต commentStep3
    } else {
      setChanneldevcomment(promotion.commentStep3); // ดึงค่าใหม่
    }
  
    if (!promotion?.commentStep4) {
      setHodcomment(''); // รีเซ็ต commentStep4
    } else {
      setHodcomment(promotion.commentStep4); // ดึงค่าใหม่
    }
  
    if (!promotion?.commentStep5) {
      setGmcomment(''); // รีเซ็ต commentStep5
    } else {
      setGmcomment(promotion.commentStep5); // ดึงค่าใหม่
    }
  }, [
    promotion?.commentStep1, 
    promotion?.commentStep2, 
    promotion?.commentStep3, 
    promotion?.commentStep4, 
    promotion?.commentStep5
  ]);
  


  useEffect(() => {
    // ตั้งค่าคอมเมนต์ต่างๆ จากข้อมูล promotion

    if (promotion && promotion.commentStep1) {
      setModernTardecomment(promotion.commentStep1);
    }
    if (promotion && promotion.commentStep2) {
      setTmkcomment(promotion.commentStep2);
    }
   
    if (promotion && promotion.commentStep3) {
      setChanneldevcomment(promotion.commentStep3);
    }
    if (promotion && promotion.commentStep4) {
      setHodcomment(promotion.commentStep4);
    }
    if (promotion && promotion.commentStep5) {
      setGmcomment(promotion.commentStep5);
    }
  }, [promotion]); // ใช้ promotion ใน dependency array
  

  useEffect(() => {
    if (promotion?.startDate && promotion?.endDate) {
      const days = calculateTotalDays(promotion.startDate, promotion.endDate);
      setTotalDays(days);
    }
  }, [promotion]);

  useEffect(() => {
    fetchPromotionDetails(documentNumber);
  }, [documentNumber, fetchPromotionDetails]);



  
  const gridApiRef = useRef(null);


  const pinnedBottomRowData = useMemo(() => {
    if (!promotion) return [];
  
    return [{
      productCode: 'Total',
      totalCTN: (promotion.grandtotalCTN || 0).toFixed(2),
      totalWsp: (promotion.grandtotalWSP || 0).toFixed(2),
      avgPercent: (promotion.grandtotalAVG || 0).toFixed(2),
      baseLine: (promotion.grandtotalbaseline || 0).toFixed(2),
      growthcal: (promotion.grandtotalgrowthcal || 0).toFixed(2),
      totalPcs: (promotion.grandtotalTotalpcs || 0).toFixed(2),
      offTake: (promotion.grandtotalTotalofftake || 0).toFixed(2),
      totalBased: (promotion.grandtotalbaselinetotal || 0).toFixed(2),
      totalGrowth: (promotion.grandtotalgrowthtotal || 0).toFixed(2),
      grandTotal: (promotion.grandtotalgrandtotal || 0).toFixed(2),
      cogBased: (promotion.grandtotalcogBased || 0).toFixed(2),
      cogEstimatedGrowth: (promotion.grandtotalEstimatedGrowth || 0).toFixed(2),
    }];
  }, [promotion]);

  
  useEffect(() => {
    if (gridApiRef.current && promotion) {
      gridApiRef.current.setPinnedBottomRowData(pinnedBottomRowData);
      
      // รีเฟรชตารางเพื่อให้แสดงผลลัพธ์ใหม่
      gridApiRef.current.refreshCells({ force: true });
    }
  }, [promotion, pinnedBottomRowData]);


  
  const [ColumnDefs] = useState([
    // Columns from firstTableColumnDefs
    {
      field: 'Product Code',
      headerName: 'รหัสสินค้า',
      width: 60,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.productCode}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'ชื่อสินค้า',
      width: 60,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.product?.productNameEng}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'RSP',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.rsp) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Packsize',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.packSize) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'GP%',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.gp) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Based',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.base) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Growth',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.growth) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    // Columns from secondTableColumnDefs
    {
      headerName: 'Estimate Sales (CTN)',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.totalCTN) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'WSP / Carton (Ex. Vat)',
      width: 50,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.wspPerCarton) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Total WSP (Ex. Vat)',
      width: 70,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.totalWsp) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'COMPENSATE(Bath) / Pcs.',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.compensatePerPcs) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Compensate%',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>
            {params.data.pencencompensate ? formatNumber(params.data.pencencompensate) + '%' : ''}
          </span>
          </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Compensate(Bath)',
      width: 40,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.avgPercent) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: '%Discount',
      flex: 1,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span>{params.data.compensateDiscount ? formatNumber(params.data.compensateDiscount) + '%' : ''}</span>
      </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    }
  ], []);

  const promotionColumnCal = useMemo(
    () => [
      {
        field: 'Product Code',
        headerName: 'รหัสสินค้า',
        width: 60,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{params.data.productCode}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'ชื่อสินค้า',
        width: 80,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{params.data.product?.productNameEng}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },

      {
        headerName: 'BaseLine(CTN)',
        width: 60,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{formatNumber(params.data.baseLine) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'Growth(CTN)',
        width: 60,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{formatNumber(params.data.growthcal) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'totalCTN',
        width: 40,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{(params.data.totalCTN)?.toLocaleString() || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'TotalPcs',
        width: 60,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{(params.data.totalPcs)?.toLocaleString() || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      }
      ,
      {
        headerName: 'OffTake',
        width: 40,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{formatNumber(params.data.offTake) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'totalBased',
        width: 40,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{formatNumber(params.data.totalBased) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'totalGrowth',
        width: 40,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{formatNumber(params.data.totalGrowth) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'GrandTotal(Bath)',
        width: 40,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{formatNumber(params.data.grandTotal) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogperunit',
        headerName: 'cogperunit',
        width:40,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{formatNumber(params.data.cogperunit) || ''}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogBased',
        headerName: 'cogBased',
        width: 40,
        cellRenderer: params => (
          params.node.rowPinned ? (
            <span>{formatNumber(params.data.cogBased) || ''}</span>
          ) : (
            <span style={{ visibility: 'hidden' }}>{formatNumber(params.data.cogBased) || ''}</span>  
          )
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogEstimatedGrowth',
        headerName: 'cogEstimatedGrowth',
        flex: 1,
        cellRenderer: params => (
          params.node.rowPinned ? (
            <span>{formatNumber(params.data.cogEstimatedGrowth) || ''}</span>  // แสดงค่าเฉพาะใน pinned bottom
          ) : (
            <span style={{ visibility: 'hidden' }}>{formatNumber(params.data.cogEstimatedGrowth) || ''}</span>  // ซ่อนค่าสำหรับแถวทั่วไป
          )
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
    ],
    []
  );


  const COGColumnCal = useMemo(
    () => [
      {
        field: 'cogperunit',
        headerName: 'cogperunit',
        width:180,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{params.data.cogperunit}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogBased',
        headerName: 'cogBased',
        width:180,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{params.data.cogBased}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogEstimatedGrowth',
        headerName: 'cogEstimatedGrowth',
        flex:1,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{params.data.cogEstimatedGrowth}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },

     
    ],
    []
  );

  const enrichedProposals = proposals.map((proposal) => [
    {
      description: 'NIV Sales',
      basedSales: formatNumber(proposal.based_nivSales),
      estimateGrowthSales: formatNumber(proposal.growth_nivSales),
      incrementalProfitLoss: formatNumber(proposal.nivincremental_Profit),
      growthPercent: proposal.nivgp_Percent ? Number(proposal.nivgp_Percent).toFixed(2) + '%' : undefined
    },
    {
      description: 'Less: Special Promotion Discount',
      estimateGrowthSales: formatNumber(proposal.growth_SpecialPromoDiscount),
      incrementalProfitLoss: formatNumber(proposal.promoDiscount_incrementalProfit),
      growthPercent: proposal.specialPromoGp_Percent ? Number(proposal.specialPromoGp_Percent).toFixed(2) + '%' : undefined
    },
    {
      description: 'Less: List in NPD Fee, Electric Fee, Fis Rebate',
      basedSales: formatNumber(proposal.based_NpdFeeElecRebate),
      estimateGrowthSales: formatNumber(proposal.growth_NpdFeeElecRebate),
      incrementalProfitLoss: formatNumber(proposal.feeElecRebate_incrementalProfit),
    },
    {
      description: 'NSR',
      basedSales: formatNumber(proposal.based_NSR),
      estimateGrowthSales: formatNumber(proposal.growth_NSR),
      incrementalProfitLoss: formatNumber(proposal.nSR_incrementalProfit),
      growthPercent: proposal.nsr_Percent ? Number(proposal.nsr_Percent).toFixed(2) + '%' : undefined

    },
    {
      description: 'Less: COGs',
      basedSales: formatNumber(proposal.based_COG),
      estimateGrowthSales: formatNumber(proposal.growth_COG),
      incrementalProfitLoss: formatNumber(proposal.cog_incrementalProfit),
    },
    {
      description: 'Gross Profit',
      basedSales: formatNumber(proposal.based_grossprofit),
      estimateGrowthSales: formatNumber(proposal.growth_grossprofit),
      incrementalProfitLoss: formatNumber(proposal.gross_profit),
    },
    {
      description: '',
      basedSales: proposal.basegppercentage ? Number(proposal.basegppercentage).toFixed(2) + '%' : undefined,
      estimateGrowthSales: proposal.growthgppercentage ? Number(proposal.growthgppercentage).toFixed(2) + '%' : undefined,
      incrementalProfitLoss: undefined,
    },
    {
      description: 'Less: Delivery-Other, Petrol',
      basedSales: formatNumber(proposal.based_DeliveryOtherPetrol),
      estimateGrowthSales: formatNumber(proposal.growth_DeliveryOtherPetrol),
      incrementalProfitLoss: formatNumber(proposal.deliveryOther_incrementalProfit),
    },
    {
      description: 'Less: A&P and Consumable',
      basedSales: formatNumber(proposal.based_ApAndConsumable),
      estimateGrowthSales: formatNumber(proposal.growth_ApAndConsumable),
      incrementalProfitLoss: formatNumber(proposal.consumable_incrementalProfit),
    },
    {
      description: 'Less: Freezer DP',
      basedSales: formatNumber(proposal.based_FreezerDp),
      estimateGrowthSales: formatNumber(proposal.growth_FreezerDp),
    },
    {
      description: '',
      basedSales: undefined,
      estimateGrowthSales: undefined,
      incrementalProfitLoss: undefined,
    },
    {
      description: 'Total Expense',
      basedSales: formatNumber(proposal.based_totalexpense),
      estimateGrowthSales: formatNumber(proposal.growth_totalexpense),
      incrementalProfitLoss: formatNumber(proposal.totalexpense_incrementalProfit),
    },
    {
      description: 'Profit Contribution',
      basedSales: formatNumber(proposal.based_profitcontribution),
      estimateGrowthSales: formatNumber(proposal.growth_profitcontribution),
      incrementalProfitLoss: proposal.profitcontribution_incrementalProfit >= 0 
      ? '+' + formatNumber(proposal.profitcontribution_incrementalProfit) 
      : formatNumber(proposal.profitcontribution_incrementalProfit),
    },
    {
      description: 'Profit Percentage',
      basedSales: proposal.based_profitcontributionpercen > 0
        ? '+' + formatNumber(proposal.based_profitcontributionpercen) + '%'
        : formatNumber(proposal.based_profitcontributionpercen) + '%',
      estimateGrowthSales: proposal.growth_profitcontributionpercen > 0
        ? '+' + formatNumber(proposal.growth_profitcontributionpercen) + '%'
        : formatNumber(proposal.growth_profitcontributionpercen) + '%',
      incrementalProfitLoss: proposal.profitcontribution_incrementalProfitpercen > 0
        ? '+' + formatNumber(proposal.profitcontribution_incrementalProfitpercen) + '%'
        : formatNumber(proposal.profitcontribution_incrementalProfitpercen) + '%',
    },
  ]);
 
  const ContributionEvaluationDefs = useMemo(() => [
    {
      field: 'description',
      headerName: '',
      pinned: 'left',
      width: 200,
      cellRenderer: params => (
        <div className='flex justify-start items-start text-start '>
          <span>{params.data.description}</span>
        </div>
      ),
      cellStyle: params => {
        if (params.value === 'Total Expense' || params.value === 'Profit Contribution') {
          return {
            backgroundColor: '#ffeb3b', 
            color: '#000', 
            fontWeight: 'bold',
          };
        }
        return { fontWeight: 'bold', display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
      },
      headerClass: 'align-left',
    },
    {
      field: 'basedSales',
      headerName: 'Based Sales',
      width: 140,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.basedSales || ''}</span>
        </div>
      ),
      cellStyle: params => {
        if (params.data.description === 'Total Expense' || params.data.description === 'Profit Contribution') {
          return {
            backgroundColor: '#ffeb3b', 
            color: '#000', 
          };
        }
        return { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
      },
      headerClass: 'align-left',
    },
    {
      field: 'estimateGrowthSales',
      headerName: 'Estimate Growth Sales',
      width: 140,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.estimateGrowthSales || ''}</span>
        </div>
      ),
      cellStyle: params => {
        if (params.data.description === 'Total Expense' || params.data.description === 'Profit Contribution') {
          return {
            backgroundColor: '#ffeb3b', // สีเหลืองเด่น
            color: '#000', // สีตัวหนังสือดำเพื่ออ่านง่าย
          };
        }
        return { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
      },
      headerClass: 'align-left',
    },
    {
      field: 'incrementalProfitLoss',
      headerName: 'Incremental Profit(Loss)',
      width: 140,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.incrementalProfitLoss || ''}</span>
        </div>
      ),
      cellStyle: params => {
        if (params.data.description === 'Total Expense' || params.data.description === 'Profit Contribution') {
          return {
            backgroundColor: '#ffeb3b', // สีเหลืองเด่น
            color: '#000', // สีตัวหนังสือดำเพื่ออ่านง่าย
          };
        }
        return { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
      },
      headerClass: 'align-left',
    },
    {
      field: 'growthPercent',
      headerName: '% Growth',
      flex:1,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.growthPercent || ''}</span>
        </div>
      ),
      cellStyle: params => {
        if (params.data.description === 'Total Expense' || params.data.description === 'Profit Contribution') {
          return {
            backgroundColor: '#ffeb3b', // สีเหลืองเด่น
            color: '#000', // สีตัวหนังสือดำเพื่ออ่านง่าย
          };
        }
        return { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' };
      },
      headerClass: 'align-left',
    },
  ], []);

  const gridOptions = useMemo(
    () => ({
      defaultColDef: {
        resizable: false,
        sortable: false,
        filter: false,
      },
      pagination: false,
      paginationPageSize: 10,
      paginationPageSizeSelector: [10, 20, 50],
      rowHeight: 60,
      suppressMovableColumns: true,
      domLayout: 'autoHeight',
      pinnedBottomRowData,
      getRowStyle: (params) => {
        if (params.node.rowPinned === 'bottom') {
          return { fontWeight: 'bold' };
        }
      },
    }),
    [pinnedBottomRowData]
  );

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  
    // ตั้งค่า pinnedBottomRowData ทันทีที่กริดพร้อมและข้อมูลถูกโหลดมาแล้ว
    if (!isLoading && promotion) {
      params.api.setPinnedBottomRowData(pinnedBottomRowData);
      params.api.refreshCells({ force: true }); // รีเฟรชกริดทันที
    }
  };

  return (
   <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading} // เปิด Backdrop เมื่อ loading เป็น true
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    <div className="w-full min-h-screen bg-white border rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Promotion Proposal / แบบฟอร์มขอโปรโมชั่น</h2>
      <section className="border-b-2 pb-4 mb-6">
        <h3 className="font-bold  mb-2 text-blue-700  text-xl">CUSTOMER INFORMATION / รายละเอียดลูกค้า</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium">Promotion No.</label>
            <input type="text" className="mt-1 p-2 block w-full border rounded-md cursor-pointer focus:outline-none" readOnly value={promotionDetails?.[0]?.promotionNo || ''} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Request Date</label>
            <input
              readOnly
              className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
              value={promotion?.createdAt ? formatDate(promotion.createdAt) : ''}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Promotion Title</label>
            <input type="text" className="mt-1 p-2 block w-full border rounded-md  cursor-pointer focus:outline-none" readOnly value={promotion?.promotionTitle || ''} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Promotion Type</label>
            <input type="text" className="mt-1 p-2 block w-full border rounded-md cursor-pointer focus:outline-none " readOnly value={promotion?.promotionType || ''} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Channel</label>
            <input type="text" className="mt-1 p-2 block w-full border rounded-md cursor-pointer focus:outline-none " readOnly value={customer?.channel || ''} />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Customer</label>
            <input type="text" className="mt-1 p-2 block w-full border rounded-md cursor-pointer focus:outline-none " readOnly value={customer?.companyName || ''} />
          </div>
        </div>
      </section>


{/* ///////////////////////////////////// */}
      <section className="border-b-2 pb-4 mb-6">
        <h3 className="font-bold text-blue-700 mb-2 text-xl">PROMOTION ITEM / รายการสินค้าในโปรโมชั่น</h3>
        <div className="flex flex-wrap  justify-between gap-4 ">
          <div>
            <label className="block text-gray-700 font-medium">Promotion Period / ระยะเวลาโปรโมชั่น</label>
            <div className="flex space-x-4">
              <div>
                <label>Start/วันเริ่ม</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
                  readOnly
                  value={promotion?.startDate ? formatDate(promotion.startDate) : ''}
                />
              </div>
              <div>
                <label>To/ถึง</label>
                <input
                  type="text"
                  className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
                  readOnly
                  value={promotion?.endDate ? formatDate(promotion.endDate) : ''}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-6  w-full">
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium">จำนวนวัน</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
                value={totalDays}
                readOnly
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium">จำนวนสาขาที่ร่วมโปร</label>
              <input
                type="text"
                className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
                readOnly
                value={promotion?.store_applied || ''}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-gray-700 font-medium">ตู้แช่</label>
              <input
                type="text"
                className="mt-1 p-2 block w-44 border rounded-md focus:outline-none cursor-pointer"
                readOnly
                value={promotion?.storeSize || ''}
              />
            </div>
          </div>
        </div>
      </section>


      <div className="mb-2">
  <div className="text-xs text-red-500 bg-red-50 p-2 rounded-md mb-2 border border-red-200">
    <span className="font-medium">หมายเหตุ: Base Sale</span> (หน่วย/ชิ้น) ยอดขายปกติในช่วงที่ไม่มีการจัดโปรโมชั่น : จำนวนชิ้น ต่อสาขา ต่อวัน (โดยอ้างอิงจากยอดขายเฉลี่ยย้อนหลัง เช่น 1-6 เดือนย้อนหลัง)
  </div>
  <div className="text-xs text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
    <span className="font-medium">หมายเหตุ: Estimate Growth Sale</span> (หน่วย/ชิ้น) ยอดขายที่คาดว่าจะเกิดขึ้นในช่วงระยะเวลาจัดโปรโมชั่น : จำนวนชิ้น ต่อสาขา ต่อวัน (โดยประเมินจากเป้าหมายการเติบโตของยอดขายที่เกิดจากโปรโมชั่น เช่น ส่วนลด หรือกิจกรรมส่งเสริมการขาย อาจอ้างอิงจากประวัติการจัดโปรโมชั่นก่อนหน้า หรือ Benchmark ของสินค้าคล้ายกันในช่วงเวลาเดียวกัน)
  </div>
</div>

      <div className="w-full">
      <section className="ag-theme-alpine w-full flex flex-col gap-4">
      <AgGridReact
      className="ag-theme-alpine custom-font-size" 
      rowData={rowData}
      columnDefs={ColumnDefs} // ตารางที่รวมเข้าด้วยกัน
      gridOptions={{
        pagination: false,
        domLayout: 'autoHeight'
      }}
      defaultColDef={{
        resizable: false,
      }}
      pinnedBottomRowData={pinnedBottomRowData}
    />
</section>


<section className="border-b-2 pb-4 mb-6 mt-2 section-next">
  <h4 className="text-xs text-gray-600 mb-4 bg-red-500">ค่าใช้จ่ายเพิ่มเติม</h4>
  <div className="grid grid-cols-6 gap-4">
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.1.ค่าเปิดหน้าบัญชี</h1></div>
      <input
        type="text"
        value={promotion?.accountOpeningFee || ''}
        readOnly
        className="mt-1 p-1 block w-full border rounded-md text-xs"
      />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.2 Listing Fee</h1></div>
      
      <input
        type="text"
        value={promotion?.listingFee || ''}
        readOnly
        className=" mt-1 p-1 block w-full border rounded-md text-xs"
      />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.3 ค่าระบบ</h1></div>
      <input
        type="text"
        value={promotion?.systemCost || ''}
        readOnly
        className=" mt-1 p-1 block w-full border rounded-md text-xs"
      />
    </div>
    <div className="flex flex-col">
      <div className=" flex items-center text-xs"><h1>4.4 ค่าวางสินค้า</h1></div>
      <input
        type="text"
        value={promotion?.placementFee || ''}
        readOnly
        className="mt-1 p-1 block w-full border rounded-md text-xs"
      />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.5 ค่าไฟ</h1></div>
      <input
        type="text"
        value={promotion?.electricityFee || ''}
        readOnly
        className="mt-1 p-1 block w-full border rounded-md text-xs"
      />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.6 ไอศกรีมฟรี FOC</h1></div>
      <input
        type="text"
        value={promotion?.focfreeicecreamFee || ''}
        readOnly
        className="mt-1 p-1 block w-full border rounded-md text-xs"
      />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.7 สนับสนุน FOC</h1></div>
      <input
        type="text"
        value={promotion?.focsupportFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="flex items-center text-xs"><h1>4.8 อื่นๆ</h1></div>
      <input
        type="text"
        value={promotion?.otherFees || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
  </div>
</section>


</div>

      <section className="border-b-2 pb-4 mb-4">
        <h4 className="text-md text-gray-600 mb-2">Mechanic Promotion / รายละเอียดโปรโมชั่น</h4>
        <input
          className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
          rows="3"
          value={promotion?.detailpromotion || ''}
          readOnly
        />
      </section>

      <section className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 font-medium">Requestor</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value={promotion?.user?.nameThai || ""} readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Review</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='STEP_1' readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Review</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='STEP_2' readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Review</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='STEP_3' readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Approval</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='STEP_4' readOnly />
        </div>
        {/* <div>
          <label className="block text-gray-700 font-medium">Approval</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='GM' readOnly />
        </div> */}
      </section>

      {/* <div className='flex justify-start items-center gap-20 '>
        <div className='flex justify-center items-center gap-2'>
          <h1>STEP_1</h1>
          <input type="text" className="mt-1 p-2 block w-56 border rounded-md focus:outline-none cursor-pointer  " readOnly />
          
        </div>
        <div className='flex justify-center items-center gap-2'>
          <h1>Date</h1>
          <input type="text" className="mt-1 p-2 block w-56 border rounded-md focus:outline-none cursor-pointer  " readOnly />
          
        </div>
      </div> */}
      <div className='mt-14 mb-4 flex justify-center gap-20'>
        <h1>เหตุผล</h1>
        <textarea
          className="mt-1 p-2 block w-full h-32 border rounded-md focus:outline-none cursor-pointer "
          style={{ textAlign: 'left', verticalAlign: 'top' }}
          readOnly
          value={promotion?.remark || ''}
        />
      </div>

<div className='.'></div>


{/* Profit & Loss */}
{['Approved_Step2', 'Approved_Step1', 'Approved_Step3', 'Approved_Step4', 'GM'].includes(authUser.role_code) && (
  <>
    
    

    {showProfitAndLoss && (
  <>
      <h4 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl"> Profit & Loss / สรุป</h4>
    <div className='w-full'>
      <AgGridReact
        className="ag-theme-alpine custom-font-size2" 
        rowData={rowData}
        columnDefs={promotionColumnCal} // ตารางที่ 1
        gridOptions={{
          pagination: false,
          domLayout: 'autoHeight'
        }}
        defaultColDef={{
          resizable: false,
        }}
        pinnedBottomRowData={pinnedBottomRowData}
      />
    </div>

    {/* <h1 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl">COGs</h1>
    <div className='w-full'>
      <AgGridReact
        className="ag-theme-alpine custom-font-size" 
        rowData={rowData}
        columnDefs={COGColumnCal} // ตารางที่ 2
        gridOptions={{
          pagination: true,
          domLayout: 'autoHeight'
        }}
        defaultColDef={{
          resizable: false,
        }}
        pinnedBottomRowData={pinnedBottomRowData}
      />
    </div> */}
    <div className="w-full border-t border-gray-300 my-4"></div>
  </>
)}


      <div className="w-full border-t border-gray-300 my-4"></div>

      {['Approved_Step2', 'Approved_Step3', 'Approved_Step4', 'GM'].includes(authUser.role_code) && (
  <>
    <div className='flex flex-col promotion-proposal-section'>
      <h1 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl">PROMOTION PROPOSAL</h1>
      <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 items-start max-w-[800px]">
        <h1 className='font-semibold text-right'>Promotion Title :</h1>
        <h1 className="truncate">{promotion?.promotionTitle}</h1>

        <h1 className='font-semibold text-right self-start'>Product participated :</h1>
        <h1 className="break-words">Product SKU {rowData.length}</h1>

        <h1 className='font-semibold text-right'>Promotion Channel :</h1>
        <h1>{promotion?.customer.companyName}</h1>

        <h1 className='font-semibold text-right'>Promotion Period :</h1>
        <h1> {proposals?.[0]?.date || ''}</h1>
      </div>
    </div>

    <div>
      <section className="ag-theme-alpine custom-header-color2 mb-6 custom-paging-color2" style={{ width: '100%' }}>
        <h1 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl">Contribution Evaluation (Baht)</h1>
        <AgGridReact
          rowData={enrichedProposals[0]}
          columnDefs={ContributionEvaluationDefs}
          gridOptions={{
            suppressPaginationPanel: true,
            domLayout: 'autoHeight'
          }}
          defaultColDef={{
            resizable: false,
            width: 100, // ค่า width สำหรับตารางที่สอง
          }}
        />
      </section>
    </div>

    <table className="w-full border-collapse border border-black" style={{ fontSize: '8px', padding: '2px' }}>
      <thead>
        <tr>
          <th className="border border-black text-left p-1 bg-amber-500" style={{ padding: '2px' }}>
            Details of A&P Expense **
          </th>
          <th className="border border-black text-right p-1 bg-amber-500" style={{ padding: '2px' }}>
            Total (Baht)
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-black text-left p-1 bg-gray-100" style={{ padding: '2px' }}>
            Promotion Expenses :
          </td>
          <td className="border-none bg-gray-100" style={{ padding: '2px' }}></td>
        </tr>
        <tr>
          <td className="border border-black text-left p-1 bg-gray-100" style={{ padding: '2px' }}>
            - Additional cost of Compensate
          </td>
          <td className="border border-black text-right p-1 bg-gray-100" style={{ padding: '2px' }}>
            {proposals?.[0]?.promotionExpenses?.toLocaleString() || '0'}
          </td>
        </tr>
        <tr>
          <td className="italic border-none text-left p-1" style={{ padding: '2px' }}></td>
          <td className="border-none" style={{ padding: '2px' }}></td>
        </tr>
        <tr>
          <td className="font-bold border border-black text-left p-1 bg-amber-500" style={{ padding: '2px' }}>
            TOTAL PROMOTION COST
          </td>
          <td className="font-bold border border-black text-right p-1 bg-amber-500" style={{ padding: '2px' }}>
            {proposals?.[0]?.promotionExpenses?.toLocaleString() || '0'}
          </td>
        </tr>
      </tbody>
    </table>
  </>
)}



    <div className='mt-1'></div>
    <Divider />
  </>
)}

{/* FooterProfit & Loss */}


{/* Modern Trade */}
<div className='w-full mt-0'>
  <div className='grid grid-cols-3 gap-2 p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>Modern Trade</h1>
      <input
        className={`border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1 ${
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep1 === false &&
          promotion?.Approved_Date_Step1
            ? 'text-orange-700 font-bold' 
            : promotion?.ApprovedStep1 === true
            ? 'text-green-700 font-bold' 
            : 'text-red-500'
        }`}
        readOnly
        value={
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep1 === false &&
          promotion?.Approved_Date_Step1
            ? promotion.step 
            : promotion?.ApprovedStep1 === true
            ? 'Review'
            : 'Waiting for Approval'
        }
      />
    </div>
    <div></div>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>Date</h1>
      <input 
        className='border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1'
        readOnly
        value={promotion?.Approved_Date_Step1 ? 
          new Date(promotion.Approved_Date_Step1).toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '')
          : ''
        } 
      />
    </div>
  </div>

  <div className='p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-20 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep1 || ''} 
  onChange={(e) => setModernTardecomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step1'|| promotion?.ApprovedStep1 === true || promotion?.ApprovedStep1 === 1}
/>
    </div>
  </div>

  {promotion?.step === 'Waiting For Approved_Step1' && authUser.role_code === 'Approved_Step1' && (
    <div className='flex gap-2 p-1'>
      <button 
        className='bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For Approved_Step1'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-3 py-1 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
    </div>
  )}
</div>

{/* Approved_Step2 */}
<div className='w-full mt-0'>
  <div className='grid grid-cols-3 gap-2 p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>STEP_2</h1>
      <input
        className={`border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1 ${
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep2 === false &&
          promotion?.Approved_Date_Step2
            ? 'text-orange-700 font-bold' 
            : promotion?.ApprovedStep2 === true
            ? 'text-green-700 font-bold' 
            : 'text-red-500'
        }`}
        readOnly
        value={
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep2 === false &&
          promotion?.Approved_Date_Step2
            ? promotion.step 
            : promotion?.ApprovedStep2 === true
            ? 'Review'
            : 'Waiting for Approval'
        }
      />
    </div>
    <div></div>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>Date</h1>
      <input 
        className='border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1'
        readOnly
        value={promotion?.Approved_Date_Step2 ? 
          new Date(promotion.Approved_Date_Step2).toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '')
          : ''
        } 
      />
    </div>
  </div>

  <div className='p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-20 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep2 || ''} 
  onChange={(e) => setTmkcomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step2' || promotion?.ApprovedStep2 === true || promotion?.ApprovedStep2 === 1}
/>
    </div>
  </div>

  {promotion?.step === 'Waiting For Approved_Step2' && authUser.role_code === 'Approved_Step2' && (
    <div className='flex gap-2 p-1'>
      <button 
        className='bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-3 py-1 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
    </div>
  )}
</div>

{/* STEP_3 */}
<div className='w-full mt-0'>
  <div className='grid grid-cols-3 gap-2 p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>STEP_3</h1>
      <input
        className={`border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1 ${
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep3 === false &&
          promotion?.Approved_Date_Step3
            ? 'text-orange-700 font-bold' 
            : promotion?.ApprovedStep3 === true
            ? 'text-green-700 font-bold' 
            : 'text-red-500'
        }`}
        readOnly
        value={
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep3 === false &&
          promotion?.Approved_Date_Step3
            ? promotion.step 
            : promotion?.ApprovedStep3 === true
            ? 'Review'
            : 'Waiting for Approval'
        }
      />
    </div>
    <div></div>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>Date</h1>
      <input 
        className='border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1'
        readOnly
        value={promotion?.Approved_Date_Step3 ? 
          new Date(promotion.Approved_Date_Step3).toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '')
          : ''
        } 
      />
    </div>
  </div>

  <div className='p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-20 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep3 || ''} 
  onChange={(e) => setChanneldevcomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step3' || promotion?.ApprovedStep3 === true || promotion?.ApprovedStep3 === 1}
/>  
    </div>
  </div>

  {promotion?.step === 'Waiting For Approved_Step3' && authUser.role_code === 'Approved_Step3' && (
    <div className='flex gap-2 p-1'>
      <button 
        className='bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For Approved_Step3'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-3 py-1 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
    </div>
  )}
</div>

{/* Approved_Step4 */}
<div className='w-full mt-0'>
  <div className='grid grid-cols-3 gap-2 p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>STEP_4</h1>
      <input
        className={`border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1 ${
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep4 === false &&
          promotion?.Approved_Date_Step4
            ? 'text-orange-700 font-bold' 
            : promotion?.ApprovedStep4 === true
            ? 'text-green-700 font-bold' 
            : 'text-red-500'
        }`}
        readOnly
        value={
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep4 === false &&
          promotion?.Approved_Date_Step4
            ? promotion.step 
            : promotion?.ApprovedStep4 === true
            ? 'Approved'
            : 'Waiting for Approval'
        }
      />
    </div>
    <div></div>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>Date</h1>
      <input 
        className='border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1'
        readOnly
        value={promotion?.Approved_Date_Step4 ? 
          new Date(promotion.Approved_Date_Step4).toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '')
          : ''
        } 
      />
    </div>
  </div>

  <div className='p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
   <textarea 
  className='border rounded-lg w-full h-20 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep4 || ''} 
  onChange={(e) => setHodcomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step4' || promotion?.ApprovedStep4 === true || promotion?.ApprovedStep4 === 1}
/>  
    </div>
  </div>

  {promotion?.step === 'Waiting For Approved_Step4' && authUser.role_code === 'Approved_Step4' && (
    <div className='flex gap-2 p-1'>
      <button 
        className='bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For Approved_Step4'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-3 py-1 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
      <button 
      className='bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-400'
      onClick={() => handleApproval('reject')} 
      >
        Reject
      </button>
    </div>
  )}
</div>

{/* GM */}
{/* <div className='w-full mt-0'>
  <div className='grid grid-cols-3 gap-2 p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>GM</h1>
      <input
        className={`border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1 ${
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep5 === false &&
          promotion?.Approved_Date_Step5
            ? 'text-orange-700 font-bold' 
            : promotion?.ApprovedStep5 === true
            ? 'text-green-700 font-bold' 
            : 'text-red-500'
        }`}
        readOnly
        value={
          (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') &&
          promotion?.ApprovedStep5 === false &&
          promotion?.Approved_Date_Step5
            ? promotion.step 
            : promotion?.ApprovedStep5 === true
            ? 'Approved'
            : 'Waiting for Approval'
        }
      />
    </div>
    <div></div>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>Date</h1>
      <input 
        className='border rounded-lg w-full h-7 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-1'
        readOnly
        value={promotion?.Approved_Date_Step5 ? 
          new Date(promotion.Approved_Date_Step5).toLocaleString('th-TH', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          }).replace(',', '')
          : ''
        } 
      />
    </div>
  </div>

  <div className='p-1'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-20 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep5 || ''} 
  onChange={(e) => setGmcomment(e.target.value)}
  readOnly={authUser.role_code !== 'GM' || promotion?.ApprovedStep5 === true || promotion?.ApprovedStep5 === 1}
/>  
    </div>
  </div>

  {promotion?.step === 'Waiting For GM' && authUser.role_code === 'GM' && (
    <div className='flex gap-2 p-1'>
      <button 
        className='bg-green-600 text-white rounded-lg px-3 py-1 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For GM'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-3 py-1 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
      <button 
      className='bg-red-500 text-white rounded-lg px-3 py-1 hover:bg-red-400'
      onClick={() => handleApproval('reject')} 
      >
        Reject
      </button>
    </div>
  )}
</div>



<Divider /> */}

{/* Footer */}
<div className="mt-4 flex justify-center gap-6">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={handlePrint}
        >
          พิมพ์
        </button>
        <button
          className="bg-orange-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-orange-500"
          onClick={handleReturnHome}
        >
          กลับหน้าแรก
        </button>
      </div>
      
    </div>

    <style>{`
  @media print {
    /* ซ่อนองค์ประกอบที่ไม่ต้องการแสดงเมื่อปริ้น เช่น View */
    .view-header,
    .view-header * {
      display: none !important;
    }

    /* ซ่อนปุ่ม */
    button,
    .no-print {
      display: none !important;
    }

    /* เปลี่ยนสีหัวข้อของตาราง (Header) */
    .ag-header, .ag-header-cell, .ag-header-group-cell {
      background-color: #007BFF !important; /* สีฟ้าสำหรับพื้นหลัง */
      color: white !important; /* สีขาวสำหรับข้อความ */
      border: 1px solid #ccc !important;
      box-shadow: none !important;
      -webkit-print-color-adjust: exact;
    }

    /* กำหนดสีพื้นหลังสำหรับแต่ละแถวของตาราง */
    .ag-row {
      background-color: white !important;
      -webkit-print-color-adjust: exact;
    }

    /* แถวคู่และแถวคี่ */
    .ag-row-even {
      background-color: #f9f9f9 !important;
      -webkit-print-color-adjust: exact;
    }

    .ag-row-odd {
      background-color: white !important;
      -webkit-print-color-adjust: exact;
    }

    /* เปลี่ยนหน้ากระดาษเป็นแนวนอน และเพิ่มการเว้นขอบกระดาษ */
    @page {
      size: A4;
      margin: 10mm 10mm 10mm 10mm; /* เว้นขอบ 10mm รอบกระดาษ */
    }

    /* เพิ่มการเว้นขอบด้านบนในทุกครั้งที่ตัดหน้ากระดาษ */
    .ag-root {
      margin-top: 10mm; /* เว้นขอบด้านบน 10mm เมื่อเริ่มหน้าใหม่ */
    }

    /* ปรับขนาดฟอนต์ ปรับระยะห่างของ input, textarea, button, header และ cell */
    input,
    textarea,
    button,
    .ag-header-cell,
    .ag-cell {
      font-size: 7px !important; /* ลดขนาดฟอนต์เป็น 7px */
      padding: 1px 2px !important;
      margin: 1px !important;
    }

    /* ลดขนาดฟอนต์ของ label */
    label {
      font-size: 8px !important; /* ลดขนาดฟอนต์ของ label เป็น 8px */
    }

    .ag-theme-alpine {
      font-size: 4px !important; /* ขนาดฟอนต์เล็กลง */
    }

    .ag-row,
    .ag-header-cell {
    font-size: 6px !important;
      min-height: 8px !important; /* ลดความสูงของแถว */
      line-height: 1 !important;
    }

    button {
      padding: 1px 2px !important; /* ปรับระยะห่างของปุ่ม */
    }

    textarea {
      height: 20px !important; /* ลดความสูงของ textarea */
    }

    h1,
    h2,
    h3,
    h4 {
      font-size: 7px !important; /* ลดขนาดฟอนต์ของหัวข้อ */
      margin: 1px 0 !important;
    }

    .grid,
    .grid-cols-3,
    .grid-cols-2,
    .flex {
      gap: 4px !important; /* ลดระยะห่างระหว่างองค์ประกอบ */
    }
  }
`}</style>



    </>
    
  );
}
