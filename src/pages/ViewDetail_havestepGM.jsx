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




export default function ViewDetail() {
  const { documentNumber } = useParams();
  const [channel, setChannel] = useState(''); 
  const [totalDays, setTotalDays] = useState('');
  const [showPromotionCalGrid, setshowPromotionCalGrid] = useState(true);
  const { authUser } = useAuth();
  const [persistentTotals, setPersistentTotals] = useState(null);
  const { rowData, fetchPromotionDetails, promotion, customer, promotionDetails, proposals, isLoading } = usePromo();

  const [commentStep1, setModernTardecomment] = useState('');
  const [commentStep2, setTmkcomment] = useState('');
  const [commentStep3, setChanneldevcomment] = useState('');
  const [commentStep4, setHodcomment] = useState('');
  const [commentStep5, setGmcomment] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showBaseGrowth, setShowBaseGrowth] = useState(false);
  const [showBaseGrowth2, setShowBaseGrowth2] = useState(false);

  const toggleBaseGrowthVisibility = () => {
    setShowBaseGrowth(!showBaseGrowth);
  };
  const toggleBaseGrowthVisibility2 = () => {
    setShowBaseGrowth2(!showBaseGrowth2);
  };

  const [showProfitAndLoss, setShowProfitAndLoss] = useState(false);

  // const handlePrint = () => {
  //   window.print();
  // };

  const handlePrint = () => {
    const printData = {
      promotionDetails: {}, // ส่งข้อมูล promotionDetails
      promotion: {}, // ส่งข้อมูล promotion
      customer: {}, // ส่งข้อมูล customer
      rowData: rowData,
      showProfitAndLoss: showProfitAndLoss, // ส่งสถานะการแสดง Profit & Loss / COGs ไปด้วย
    };

    navigate('/PromotionProposal/PrintPage', { state: { printData, isPrintMode: true } });
  };

  const showProfitAndLossToggleButton = () => {
    if (['Approved_Step2', 'Approved_Step3', 'Approved_Step4', 'GM'].includes(authUser.role_code)) {
      return (
        <div>
          <button
            onClick={() => setShowProfitAndLoss(!showProfitAndLoss)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          >
            {showProfitAndLoss ? 'ซ่อน Profit & Loss / COGs' : 'แสดง Profit & Loss / COGs'}
          </button>
        </div>
      );
    }
    return null;
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


  
  const [columnDefs] = useState([
    {
      field: 'Product Code',
      headerName: 'รหัสสินค้า',
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{formatNumber(params.data.growth) || ''}</span>
        </div>
      ),
      cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
      headerClass: 'align-left'
    },
    {
      headerName: 'Estimate Sales (CTN)',
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
      flex: 1,
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
    },    {
      headerName: 'Compensate(Bath)',
      flex: 1,
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
        width: 60,
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
        width: 60,
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
        width: 60,
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
        width: 60,
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
        width:60,
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
        width: 60,
        cellRenderer: params => (
          params.node.rowPinned ? (
            <span>{formatNumber(params.data.cogBased) || ''}</span>  // แสดงค่าเฉพาะใน pinned bottom
          ) : (
            <span style={{ visibility: 'hidden' }}>{formatNumber(params.data.cogBased) || ''}</span>  // ซ่อนค่าสำหรับแถวทั่วไป
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
        width: 100,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{formatNumber(params.data.cogperunit)}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogBased',
        headerName: 'cogBased',
        width: 100,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{formatNumber(params.data.cogBased)}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        field: 'cogEstimatedGrowth',
        headerName: 'cogEstimatedGrowth',
        width: 100,
        cellRenderer: params => (
          <div className='flex justify-start items-start text-start '>
            <span>{formatNumber(params.data.cogEstimatedGrowth)}</span>
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
      width: 300,
      cellRenderer: params => (
        <div className='flex justify-start items-start text-start '>
          <span>{params.data.description}</span>
        </div>
      ),
      cellStyle: params => {
        if (params.value === 'Total Expense' || params.value === 'Profit Contribution') {
          return {
            backgroundColor: '#ffeb3b', // สีเหลืองเด่น
            color: '#000', // สีตัวหนังสือดำเพื่ออ่านง่าย
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
      width: 150,
      cellRenderer: params => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span>{params.data.basedSales || ''}</span>
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
      field: 'estimateGrowthSales',
      headerName: 'Estimate Growth Sales',
      width: 200,
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
      width: 200,
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
      width: 100,
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
  

  const basegrowthColumns = useMemo(
    () => [
      {
        headerName: 'ชื่อสินค้า',
        width: 140,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{params.data.product?.productNameEng}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'Jan',
        field: 'jan',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.janSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Feb',
        field: 'feb',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.febSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Mar',
        field: 'mar',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.marSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Apr',
        field: 'apr',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.aprSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'May',
        field: 'may',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.maySelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Jun',
        field: 'jun',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.junSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Jul',
        field: 'jul',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.julSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Aug',
        field: 'aug',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.augSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Sep',
        field: 'sep',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.sepSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Oct',
        field: 'oct',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.octSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Nov',
        field: 'nov',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.novSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Dec',
        field: 'dec',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.decSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
    ],
    []
  );

  const basegrowthColumns2 = useMemo(
    () => [
      {
        headerName: 'ชื่อสินค้า',
        width: 140,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{params.data.product?.productNameEng}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'Jan',
        field: 'jan2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.janSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Feb',
        field: 'feb2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.febSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Mar',
        field: 'mar2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.marSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Apr',
        field: 'apr2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.aprSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'May',
        field: 'may2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.maySelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Jun',
        field: 'jun2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.junSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Jul',
        field: 'jul2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.julSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Aug',
        field: 'aug2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.augSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Sep',
        field: 'sep2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.sepSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Oct',
        field: 'oct2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.octSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Nov',
        field: 'nov2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.novSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
      {
        headerName: 'Dec',
        field: 'dec2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.decSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          if (!params.value || params.value === 0) return '';
          const value = Math.round(params.value);
          return value === 0 ? '' : value.toString();
        }
      },
    ],
    []
  );
  
  const CalbasegrowthColumns = useMemo(
    () => [
      {
        headerName: 'ชื่อสินค้า',
        flex: 1,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{params.data.product?.productNameEng}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'Jan',
        field: 'janCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.janSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Feb',
        field: 'febCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.febSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Mar',
        field: 'marCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.marSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Apr',
        field: 'aprCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.aprSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'May',
        field: 'mayCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.maySelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Jun',
        field: 'junCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.junSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Jul',
        field: 'julCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.julSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Aug',
        field: 'augCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.augSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Sep',
        field: 'sepCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.sepSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Oct',
        field: 'octCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.octSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Nov',
        field: 'novCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.novSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Dec',
        field: 'decCal',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.decSelected ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'BasedCal',
        field: 'calbased',
        flex: 1,
        cellStyle: { justifyContent: 'center', alignItems: 'center' },
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'GrowthCal',
        field: 'calgrowth',
        flex: 1,
        cellStyle: { justifyContent: 'center', alignItems: 'center' },
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Base + Growth',
        field: 'calsumBaseGrowth',
        flex: 1,
        cellStyle: { justifyContent: 'center', alignItems: 'center' },
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
    ],
    []
  );
  const CalbasegrowthColumns2 = useMemo(
    () => [
      {
        headerName: 'ชื่อสินค้า',
        flex: 1,
        cellRenderer: params => (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span>{params.data.product?.productNameEng}</span>
          </div>
        ),
        cellStyle: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center' },
        headerClass: 'align-left'
      },
      {
        headerName: 'Jan',
        field: 'janCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.janSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Feb',
        field: 'febCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.febSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Mar',
        field: 'marCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.marSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Apr',
        field: 'aprCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.aprSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'May',
        field: 'mayCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.maySelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Jun',
        field: 'junCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.junSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Jul',
        field: 'julCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.julSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Aug',
        field: 'augCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.augSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Sep',
        field: 'sepCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.sepSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Oct',
        field: 'octCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.octSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Nov',
        field: 'novCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.novSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Dec',
        field: 'decCal2',
        flex: 1,
        cellStyle: params => ({
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: params.data.decSelected2 ? 'yellow' : undefined
        }),
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'BasedCal',
        field: 'calbased2',
        flex: 1,
        cellStyle: { justifyContent: 'center', alignItems: 'center' },
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'GrowthCal',
        field: 'calgrowth2',
        flex: 1,
        cellStyle: { justifyContent: 'center', alignItems: 'center' },
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
      {
        headerName: 'Base + Growth',
        field: 'calsumBaseGrowth2',
        flex: 1,
        cellStyle: { justifyContent: 'center', alignItems: 'center' },
        valueFormatter: params => {
          const value = params.value?.toFixed(2);
          return value === '0.00' ? '' : value;
        }
      },
    ],
    []
  );
  

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

      <div className="mb-4">
  <button
    className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
    onClick={toggleBaseGrowthVisibility}
  >
    {showBaseGrowth ? 'ซ่อน' : 'แสดง Based & Growth'}
  </button>
  {showBaseGrowth && (
    <>
      <h3 className="font-bold text-blue-700 mb-0 mt-4 text-xl">Based & Growth</h3>
      <div className="flex space-x-4 mb-4">
        <div>
          <label>Start/วันเริ่ม</label>
          <input
            type="text"
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
            readOnly
            value={promotion?.baseGrowthstartDate ? formatDate(promotion.baseGrowthstartDate) : ''}
          />
        </div>
        <div>
          <label>To/ถึง</label>
          <input
            type="text"
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer"
            readOnly
            value={promotion?.baseGrowthendDate ? formatDate(promotion.baseGrowthendDate) : ''}
          />
        </div>
      </div>
      <section
        className="ag-theme-alpine custom-header-color3 custom-paging-color3 mb-4"
        style={{ width: '100%' }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={basegrowthColumns}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </section>
      <section
        className="ag-theme-alpine custom-header-color3 custom-paging-color3"
        style={{ width: '100%' }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={CalbasegrowthColumns}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
        />
      </section>

      <button
        className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 mt-4"
        onClick={toggleBaseGrowthVisibility2}
      >
        {showBaseGrowth2 ? 'ซ่อน' : 'แสดง Based & Growth เพิ่มเติม'}
      </button>
      {showBaseGrowth2 && (
        <section
          className="ag-theme-alpine custom-header-color3 custom-paging-color3 mb-4 mt-4"
          style={{ width: '100%' }}
        >
          <label className="mt-4 font-semibold text-lg text-blue-500">
            ตาราง Based & Growth 2
          </label>
          <AgGridReact
            rowData={rowData}
            columnDefs={basegrowthColumns2}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
          />
        </section>
      )}
      {showBaseGrowth2 && (
        <section
          className="ag-theme-alpine custom-header-color3 custom-paging-color3"
          style={{ width: '100%' }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={CalbasegrowthColumns2}
            gridOptions={gridOptions}
            onGridReady={onGridReady}
          />
        </section>
      )}
    </>
  )}
</div>


      <div className="w-full">
  <section className="ag-theme-alpine " style={{ width: '100%' }}>
    <AgGridReact
      rowData={rowData}
      columnDefs={columnDefs}
      gridOptions={gridOptions}
      onGridReady={onGridReady}
      defaultColDef={{ flex: 1, resizable: false }}
      pinnedBottomRowData={pinnedBottomRowData}
      domLayout="autoHeight" 
    />
  </section>


 
 

  <section className="border-b-2 pb-4 mb-6 mt-8 section-next">
  <h4 className="text-md text-gray-600 mb-2">ค่าใช้จ่ายเพิ่มเติม</h4>
  <div className="grid grid-cols-6 gap-4">
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.1 ค่าเปิดหน้าบัญชี</div>
      <input
        type="text"
        value={promotion?.accountOpeningFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.2 Listing Fee</div>
      <input
        type="text"
        value={promotion?.listingFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.3 ค่าระบบ</div>
      <input
        type="text"
        value={promotion?.systemCost || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.4 ค่าวางสินค้า</div>
      <input
        type="text"
        value={promotion?.placementFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.5 ค่าไฟ</div>
      <input
        type="text"
        value={promotion?.electricityFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.6 ไอศกรีมฟรี FOC</div>
      <input
        type="text"
        value={promotion?.focfreeicecreamFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.7 สนับสนุน FOC</div>
      <input
        type="text"
        value={promotion?.focsupportFee || ''}
        readOnly
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm"
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.8 อื่นๆ</div>
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


      <section className="border-b-2 pb-4 mb-6">
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
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value={promotion?.user?.nameEng || ''}  readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Review</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='STEP_1' readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Review</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='Approved_Step2' readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Review</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='Approved_Step3' readOnly />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Approval</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='Approved_Step4' readOnly />
        </div>
        {/* <div>
          <label className="block text-gray-700 font-medium">Approval</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value='GM' readOnly />
        </div> */}
      </section>

      <div className='mt-14 mb-4 flex justify-center gap-20'>
        <h1>เหตุผล</h1>
        <textarea
          className="mt-1 p-2 block w-full h-32 border rounded-md focus:outline-none cursor-pointer "
          style={{ textAlign: 'left', verticalAlign: 'top' }}
          readOnly
          value={promotion?.remark || ''}
        />
      </div>
{/*  Approved_Step1  */}
<div className='w-full mt-6 mb-4'>
  <div className='grid grid-cols-3 gap-4 p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700 cur'>Modern Tarde</h1>
<input
  className={`border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2 ${
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep1 === false && promotion?.Approved_Date_Step1
      ? 'text-orange-700 font-bold' // สำหรับ RETURN หรือ REJECT
      : promotion?.ApprovedStep1 === true
      ? 'text-green-700 font-bold' // สำหรับ Approved
      : 'text-red-500' // สำหรับ Waiting for Approval
  }`}
  readOnly
  value={
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep1 === false && promotion?.Approved_Date_Step1
      ? promotion.step // แสดงค่า RETURN หรือ REJECT
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
        className='border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2'
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

  <div className='p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-28 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep1 || ''} 
  onChange={(e) => setModernTardecomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step1'|| promotion?.ApprovedStep1 === true || promotion?.ApprovedStep1 === 1} // ตรวจสอบเงื่อนไขเพิ่มเติม
/>
    </div>
  </div>

  {/* เงื่อนไขการแสดงปุ่ม */}
  {promotion?.step === 'Waiting For Approved_Step1' && authUser.role_code === 'Approved_Step1' && (
    <div className='flex gap-4 p-2'>
      <button 
        className='bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For Approved_Step1'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
    </div>
  )}
</div>
<div className='.'></div>
{/* Profit & Loss */}
  {/* ปุ่มแสดงหรือซ่อน Profit & Loss / COGs */}
  {showProfitAndLossToggleButton()}

{/* แสดงหรือซ่อน Profit & Loss และ COGs */}
{showProfitAndLoss && (
  <>
    <h4 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl">Profit & Loss / สรุป</h4>
    <div className='ag-theme-alpine custom-header-color1 custom-paging-color1 h-[400px] w-[520px] md:w-full overflow-y-auto shadow-2xl mb-6'>
      <AgGridReact
        rowData={rowData}
        columnDefs={promotionColumnCal}
        gridOptions={gridOptions}
        onGridReady={onGridReady}
        defaultColDef={{ flex: 1, resizable: false }}
        pinnedBottomRowData={[]}
      />
    </div>



    <div className="w-full border-t border-gray-300 my-4"></div>
  </>
)}

{['Approved_Step2', 'Approved_Step3', 'Approved_Step4', 'GM'].includes(authUser.role_code) && (
  <>
    <div className="w-full border-t border-gray-300 my-4"></div>
    <h1 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl">PROMOTION PROPOSAL</h1>
    <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 items-start max-w-[800px]">
      <h1 className='font-semibold text-right'>Promotion Title :</h1>
      <h1 className="truncate">{promotion?.promotionTitle}</h1>

      <h1 className='font-semibold text-right self-start'>Product participated :</h1>
      <h1 className="break-words">Product SKU {rowData.length}</h1>

      <h1 className='font-semibold text-right'>Promotion Channel :</h1>
      <h1>{promotion?.customer.companyName}</h1>

      <h1 className='font-semibold text-right'>Promotion Period :</h1>
      <h1>{proposals?.[0]?.date || ''}</h1>
    </div>

    <section className="ag-theme-alpine custom-header-color2 mb-6 custom-paging-color2" style={{ width: '100%' }}>
      <h1 className="text-md text-blue-700 mb-2 mt-6 font-bold text-xl">Contribution Evaluation (Baht)</h1>
      <AgGridReact
        rowData={enrichedProposals[0]}  
        columnDefs={ContributionEvaluationDefs}
        gridOptions={{
          suppressPaginationPanel: true,
          domLayout: 'autoHeight',
        }}
        defaultColDef={{
          flex: 1,
          resizable: false,
          cellStyle: {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center'
          },
          headerClass: 'align-left',
        }}
      />
    </section>

    <table className="w-full border-collapse border border-black">
      <thead>
        <tr>
          <th className="border border-black text-left p-2 bg-amber-500">Details of A&P Expense **</th>
          <th className="border border-black text-right p-2 bg-amber-500">Total (Baht)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border border-black text-left p-2 bg-gray-100">Promotion Expenses :</td>
          <td className="border-none bg-gray-100"></td>
        </tr>
        <tr>
          <td className="border border-black text-left p-2 bg-gray-100 ">- Additional cost of Compensate</td>
          <td className="border border-black text-right p-2 bg-gray-100">
            {proposals?.[0]?.promotionExpenses?.toLocaleString() || '0'}
          </td>
        </tr>
        <tr>
          <td className="italic border-none text-left p-2"></td>
          <td className="border-none"></td>
        </tr>
        <tr>
          <td className="font-bold border border-black text-left p-2 bg-amber-500">
            TOTAL PROMOTION COST
          </td>
          <td className="font-bold border border-black text-right p-2 bg-amber-500">
            {proposals?.[0]?.promotionExpenses?.toLocaleString() || '0'}
          </td>
        </tr>
      </tbody>
    </table>

    <div className='mt-4'></div>
  </>
)}



{/* FooterProfit & Loss */}

{/* Approved_Step2 */}
<div className='w-full mt-6'>
  <div className='grid grid-cols-3 gap-4 p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700 cur'>STEP_2</h1>
      <input
  className={`border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2 ${
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep2 === false && promotion?.Approved_Date_Step2
      ? 'text-orange-700 font-bold' // สำหรับ RETURN หรือ REJECT
      : promotion?.ApprovedStep2 === true
      ? 'text-green-700 font-bold' // สำหรับ Approved
      : 'text-red-500' // สำหรับ Waiting for Approval
  }`}
  readOnly
  value={
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep2 === false && promotion?.Approved_Date_Step2
      ? promotion.step // แสดงค่า RETURN หรือ REJECT
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
        className='border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2'
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

  <div className='p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
      <textarea 
  className='border rounded-lg w-full h-28 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep2 || ''} 
  onChange={(e) => setTmkcomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step2'  || promotion?.ApprovedStep2 === true || promotion?.ApprovedStep2 === 1} // ตรวจสอบเงื่อนไขเพิ่มเติม
/>
    </div>
  </div>

  {/* ตรวจสอบเงื่อนไขการแสดงปุ่มเฉพาะเมื่อ promotion.step === 'Waiting For Approved_Step2' และ authUser.role_code === 'Approved_Step2' */}
  {promotion?.step === 'Waiting For Approved_Step2' && authUser.role_code === 'Approved_Step2' && (
    <div className='flex gap-4 p-2'>
      <button 
        className='bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
    </div>
  )}
</div>

<Divider />


<Divider />

{/* STEP_3 */}
<div className='w-full mt-6'>
  <div className='grid grid-cols-3 gap-4 p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700 cur'>STEP_3</h1>
<input
  className={`border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2 ${
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep3 === false && promotion?.Approved_Date_Step3
      ? 'text-orange-700 font-bold' // สำหรับ RETURN หรือ REJECT
      : promotion?.ApprovedStep3 === true
      ? 'text-green-700 font-bold' // สำหรับ Approved
      : 'text-red-500' // สำหรับ Waiting for Approval
  }`}
  readOnly
  value={
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep3 === false && promotion?.Approved_Date_Step3
      ? promotion.step // แสดงค่า RETURN หรือ REJECT
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
        className='border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2'
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

  <div className='p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-28 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep3 || ''} 
  onChange={(e) => setChanneldevcomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step3' || promotion?.ApprovedStep3 === true || promotion?.ApprovedStep3 === 1} // ตรวจสอบเงื่อนไขเพิ่มเติม
/>  

    </div>
  </div>

  {/* เงื่อนไขการแสดงปุ่ม */}
  {promotion?.step === 'Waiting For Approved_Step3' && authUser.role_code === 'Approved_Step3' && (
    <div className='flex gap-4 p-2'>
      <button 
        className='bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For Approved_Step3'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
      <button 
      className='bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-400'
      onClick={() => handleApproval('reject')} 
      >
        reject
      </button>
    </div>
  )}
</div>


<Divider />

{/* Approved_Step4 */}

<div className='w-full mt-6'>
  <div className='grid grid-cols-3 gap-4 p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700 cur'>STEP_4</h1>
<input
  className={`border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2 ${
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep4 === false && promotion?.Approved_Date_Step4
      ? 'text-orange-700 font-bold' // สำหรับ RETURN หรือ REJECT
      : promotion?.ApprovedStep4 === true
      ? 'text-green-700 font-bold' // สำหรับ Approved
      : 'text-red-500' // สำหรับ Waiting for Approval
  }`}
  readOnly
  value={
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep4 === false && promotion?.Approved_Date_Step4
      ? promotion.step // แสดงค่า RETURN หรือ REJECT
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
        className='border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2'
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

  <div className='p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
   <textarea 
  className='border rounded-lg w-full h-28 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep4 || ''} 
  onChange={(e) => setHodcomment(e.target.value)}
  readOnly={authUser.role_code !== 'Approved_Step4' || promotion?.ApprovedStep4 === true || promotion?.ApprovedStep4 === 1} // ตรวจสอบเงื่อนไขเพิ่มเติม
/>  
    </div>
  </div>

  {/* เงื่อนไขการแสดงปุ่ม */}
  {promotion?.step === 'Waiting For Approved_Step4' && authUser.role_code === 'Approved_Step4' && (
    <div className='flex gap-4 p-2'>
      <button 
        className='bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For Approved_Step4'} 
      >
        Review
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
      <button 
      className='bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-400'
      onClick={() => handleApproval('reject')} 
      >
        reject
      </button>
    </div>
  )}
</div>


<Divider />



{/* GM */}

<div className='w-full mt-6'>
  <div className='grid grid-cols-3 gap-4 p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700 cur'>GM</h1>
<input
  className={`border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2 ${
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep5 === false && promotion?.Approved_Date_Step5
      ? 'text-orange-700 font-bold' // สำหรับ RETURN หรือ REJECT
      : promotion?.ApprovedStep5 === true
      ? 'text-green-700 font-bold' // สำหรับ Approved
      : 'text-red-500' // สำหรับ Waiting for Approval
  }`}
  readOnly
  value={
    (promotion?.step === 'RETURN' || promotion?.step === 'REJECT') && promotion?.ApprovedStep5 === false && promotion?.Approved_Date_Step5
      ? promotion.step // แสดงค่า RETURN หรือ REJECT
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
        className='border rounded-lg w-full h-8 shadow-lg bg-gray-100 border-gray cursor-pointer focus:outline-none p-2'
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

  <div className='p-2'>
    <div className='flex flex-col'>
      <h1 className='font-semibold text-blue-700'>เหตุผล</h1>
<textarea 
  className='border rounded-lg w-full h-28 shadow-lg bg-gray-100 border-gray focus:outline-none focus:ring-2 focus:ring-blue-600'
  value={commentStep5 || ''} 
  onChange={(e) => setGmcomment(e.target.value)}
  readOnly={authUser.role_code !== 'GM' || promotion?.ApprovedStep5 === true || promotion?.ApprovedStep5 === 1} // ตรวจสอบเงื่อนไขเพิ่มเติม
/>  
    </div>
  </div>

  {/* เงื่อนไขการแสดงปุ่ม */}
  {promotion?.step === 'Waiting For GM' && authUser.role_code === 'GM' && (
    <div className='flex gap-4 p-2'>
      <button 
        className='bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-500'  
        onClick={() => handleApproval('approve')}
        disabled={promotion?.step !== 'Waiting For GM'} 
      >
        Approve
      </button>
      <button 
      className='bg-orange-600 text-white rounded-lg px-4 py-2 hover:bg-orange-500'
      onClick={() => handleApproval('return')} 
      >
        Return
      </button>
      <button 
      className='bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-400'
      onClick={() => handleApproval('reject')} 
      >
        reject
      </button>
    </div>
  )}
</div>


<Divider />

{/* Footer */}
<div className="mt-4 flex justify-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
          onClick={handlePrint}
        >
          พิมพ์
        </button>
      </div>
      
    </div>
    </>
    
  );
}
