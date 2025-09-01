import React, { useState, useEffect,useMemo,useRef,useCallback } from 'react';
import axios from '../config/axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Swal from 'sweetalert2';
import { MdDelete } from 'react-icons/md';
import { useAuth } from '../hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

import {
  Button,
  Backdrop,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

export default function PromotionInput() {
  const navigate = useNavigate();

  const [accountOpeningFee, setaccountOpeningFee] = useState(''); 
  const [listingFee, setListingFee] = useState(''); 
  const [systemCost, setsystemCost] = useState(''); 
  const [placementFee, setplacementFee] = useState(''); 
  const [electricityFee, setelectricityFee] = useState(''); 
  const [focfreeicecreamFee, setfocfreeicecreamFee] = useState(''); 
  const [focsupportFee, setFocsupportFee] = useState(''); 
  const [otherCosts, setOtherCosts] = useState(''); 
  const [remark, setRemark] = useState(''); 
  const [detailpromotion, setDetailPromotion] = useState(''); 
  const [loading, setLoading] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [storeSize, setStoreSize] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [companies, setCompanies] = useState([]); 
  const [channel, setChannel] = useState(''); 
  const [totalDays, setTotalDays] = useState('');
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [baseGrowthstartDate, setBaseGrowthStartDate] = useState(''); 
  const [baseGrowthendDate, setBaseGrowthEndDate] = useState(''); 
  const [rowData, setRowData] = useState([]);
  const [rowData2, setRowData2] = useState([]);
  const [grandrowData, setGrandRowData] = useState('');
  const [showPromotionCalGrid, setshowPromotionCalGrid] = useState(false);
  const [branchCount, setBranchCount] = useState('');
  const { authUser } = useAuth();
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(''); 
  const [promotionTitle, setPromotionTitle] = useState(''); 
  const [promotionType, setPromotionType] = useState('');
  const [storeSizeMapped, setStoreSizeMapped] = useState(''); 
  const [skuProduct, setSkuProduct] = useState(''); 
  const [showSection, setShowSection] = useState(false);
  const [showSection2, setShowSection2] = useState(false);
  const toggleSectionVisibility = () => {
    setShowSection((prev) => !prev);
  };
  const toggleSectionVisibility2= () => {
    setShowSection2((prev) => !prev);
  };

  // คำนวนBaseGrowth////////////////////////////////////////////////////////////////

  const [initialRowData, setInitialRowData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [rowDataBasegrowth, setRowDataBasegrowth] = useState([]);

  const [initialRowData2, setInitialRowData2] = useState([]);
  const [selectedColumns2, setSelectedColumns2] = useState([]);
  const [rowDataBasegrowth2, setRowDataBasegrowth2] = useState([]);
  const [isPromoCalculated, setIsPromoCalculated] = useState(false);




  const Calbasegrowth = [
    'Productname', 'Packsize', 'Jan', 'Feb', 'Mar', 'Apr', 
    'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
  const Calbasegrowth2 = [
    'Productname', 'Packsize', 'Jan2', 'Feb2', 'Mar2', 'Apr2', 
    'May2', 'Jun2', 'Jul2', 'Aug2', 'Sep2', 'Oct2', 'Nov2', 'Dec2'
];

const CalbasegrowthColumns = useMemo(
  () => [
    {
      headerName: 'Productname',
      field: 'productNameEng',
      flex: 2, // ปรับ flex ให้ใหญ่ขึ้น
      minWidth: 140, // กำหนดความกว้างขั้นต่ำ
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Jan',
      field: 'calculatedMonthlyData.jan',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Feb',
      field: 'calculatedMonthlyData.feb',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Mar',
      field: 'calculatedMonthlyData.mar',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Apr',
      field: 'calculatedMonthlyData.apr',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'May',
      field: 'calculatedMonthlyData.may',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Jun',
      field: 'calculatedMonthlyData.jun',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Jul',
      field: 'calculatedMonthlyData.jul',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Aug',
      field: 'calculatedMonthlyData.aug',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Sep',
      field: 'calculatedMonthlyData.sep',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Oct',
      field: 'calculatedMonthlyData.oct',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Nov',
      field: 'calculatedMonthlyData.nov',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Dec',
      field: 'calculatedMonthlyData.dec',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Based',
      field: 'BasedCal',
      flex: 1, // ปรับ flex ให้ใหญ่ขึ้น
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Growth',
      field: 'GrowthCal',
      flex: 1, // ปรับ flex ให้ใหญ่ขึ้น
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Total',
      field: 'SumBaseGrowth',
      flex: 1, // ปรับ flex ให้ใหญ่ขึ้น
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
  ],
  []
);


const CalbasegrowthColumns2 = useMemo(
  () => [
    {
      headerName: 'Productname',
      field: 'productNameEng',
      flex: 2, // ปรับ flex ให้ใหญ่ขึ้น
      minWidth: 140, // กำหนดความกว้างขั้นต่ำ
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Jan',
      field: 'calculatedMonthlyData.jan22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Feb',
      field: 'calculatedMonthlyData.feb22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Mar',
      field: 'calculatedMonthlyData.mar22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Apr',
      field: 'calculatedMonthlyData.apr22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'May',
      field: 'calculatedMonthlyData.may22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Jun',
      field: 'calculatedMonthlyData.jun22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Jul',
      field: 'calculatedMonthlyData.jul22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Aug',
      field: 'calculatedMonthlyData.aug22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Sep',
      field: 'calculatedMonthlyData.sep22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Oct',
      field: 'calculatedMonthlyData.oct22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Nov',
      field: 'calculatedMonthlyData.nov22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Dec',
      field: 'calculatedMonthlyData.dec22',
      flex: 1,
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Based',
      field: 'BasedCal2',
      flex: 1, // ปรับ flex ให้ใหญ่ขึ้น
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Growth',
      field: 'GrowthCal2',
      flex: 1, // ปรับ flex ให้ใหญ่ขึ้น
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
    {
      headerName: 'Total',
      field: 'SumBaseGrowth2',
      flex: 1, // ปรับ flex ให้ใหญ่ขึ้น
      cellStyle: { justifyContent: 'center', alignItems: 'center' },
    },
  ],
  []
);





const handleColumnCheckboxChange = (index) => {
  const fieldName = Calbasegrowth[index].toLowerCase();

  setSelectedColumns((prevSelectedColumns) => {
    const newSelectedColumns = prevSelectedColumns.includes(index)
      ? prevSelectedColumns.filter(i => i !== index)
      : [...prevSelectedColumns, index];

    // อัปเดตค่า rowData เพื่อเก็บสถานะ checkbox สำหรับแต่ละแถว
    setRowData((prevRowData) =>
      prevRowData.map((row) => ({
        ...row,
        [`${fieldName}Selected`]: newSelectedColumns.includes(index), 
      }))
    );

    return newSelectedColumns;
  });
};
const handleColumnCheckboxChange2 = (index) => {
  const fieldName = Calbasegrowth2[index].toLowerCase();

  setSelectedColumns2((prevSelectedColumns) => {
    const newSelectedColumns = prevSelectedColumns.includes(index)
      ? prevSelectedColumns.filter(i => i !== index)
      : [...prevSelectedColumns, index];

    // อัปเดตค่า rowData เพื่อเก็บสถานะ checkbox สำหรับแต่ละแถว
    setRowData2((prevRowData) =>
      prevRowData.map((row) => ({
        ...row,
        [`${fieldName}Selected`]: newSelectedColumns.includes(index), 
      }))
    );

    return newSelectedColumns;
  });
};




const handleInputChange = (e, rowIndex, colIndex) => {
  const newValue = parseFloat(e.target.value) || 0;
  const fieldName = Calbasegrowth[colIndex].toLowerCase();

  setRowData((prevRowData) => {
    const updatedRowData = [...prevRowData];
    updatedRowData[rowIndex] = {
      ...updatedRowData[rowIndex],
      [fieldName]: newValue, // อัปเดตค่าจาก input
    };

    // อัปเดต initialRowData ให้มีค่าตรงกับ `rowData`
    setInitialRowData(JSON.parse(JSON.stringify(updatedRowData))); // คัดลอกข้อมูลใหม่เพื่ออัปเดต

    return updatedRowData;
  });
};

const handleInputChange2 = (e, rowIndex, colIndex) => {
  const newValue = e.target.value; // รับค่าที่พิมพ์จาก input
  const fieldName = Calbasegrowth2[colIndex].toLowerCase(); // แปลง column name เป็น key

  setRowData2((prevRowData) => {
    const updatedRowData = [...prevRowData]; // คัดลอก array เดิม
    if (updatedRowData[rowIndex]) {
      updatedRowData[rowIndex] = {
        ...updatedRowData[rowIndex], // คัดลอกข้อมูลแถวเดิม
        [fieldName]: newValue, // อัปเดตค่าของ field ที่เปลี่ยนแปลง
      };
    }

    // อัปเดต `initialRowData2` ให้สอดคล้องกับ `rowData2` ที่เปลี่ยน
    setInitialRowData2(JSON.parse(JSON.stringify(updatedRowData))); // คัดลอกข้อมูลเพื่อป้องกันการเปลี่ยนแปลงโดยอ้างอิง
    return updatedRowData; // คืนค่าข้อมูลใหม่
  });
};


const handleRemoveRow = (rowIndex) => {
  setRowData((prevRowData) => prevRowData.filter((_, index) => index !== rowIndex));
  setRowData2((prevRowData) => prevRowData.filter((_, index) => index !== rowIndex));
};





useEffect(() => {
  if (initialRowData.length === 0 && rowData.length > 0) {
    setInitialRowData(JSON.parse(JSON.stringify(rowData))); // ใช้ JSON เพื่อคัดลอกเชิงลึก
  }
}, [rowData]);

useEffect(() => {
  if (initialRowData2.length === 0 && rowData.length > 0) {
    setInitialRowData2(JSON.parse(JSON.stringify(rowData2))); // ใช้ JSON เพื่อคัดลอกเชิงลึก
  }
}, [rowData2]);


////////////////////////////////////////////////////////////////////////////////////////////////////
  const gridApiRef = useRef(null);


  const productOptions = products.map((product) => ({
    value: product.productCode,
    label: `${product.productCode} - ${product.productNameEng}- ${product.productNameThai}`,
  }));

  const handleProductChange = (selectedOption) => {
    // ส่งค่าที่เลือกไปยังฟังก์ชัน addProductToGrid
    if (selectedOption) {
      addProductToGrid(selectedOption.value);
    }
  };


  const filterOption = (option, inputValue) => {
    return option.label.toLowerCase().includes(inputValue.toLowerCase());
  };


  const companyOptions = useMemo(() => 
    companies.map((company) => (
      <option key={company.CustomerCode} value={company.CustomerCode}>  {/* ใช้ CustomerCode เป็น key */}
        {company.companyName}
      </option>
    )),
    [companies]
  );
  
  
  // ฟังก์ชันคำนวณจำนวนวัน
  const calculateDays = (startDate, endDate) => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end - start;
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // คำนวณวัน
  
      // เพิ่ม 1 วัน เพื่อให้นับรวมวันเริ่มต้นด้วย
      const totalDays = days + 1;
  
      return totalDays;
    }
    return '';
  };


  // รวมการตั้งค่า currentDate และการ reset selectedProduct
  useEffect(() => {
    setTotalDays(calculateDays(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
  }, [rowData]);


  const handlebaseGrowthStartDateChange = (e) => {
    setBaseGrowthStartDate(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };
  const handlehandlebaseGrowthEndDateChange = (e) => {
    setBaseGrowthEndDate(e.target.value);
  };
  // คำนวณจำนวนวันใหม่เมื่อ startDate หรือ endDate มีการเปลี่ยนแปลง


  
  useEffect(() => {
    setTotalDays(calculateDays(startDate, endDate));
  }, [startDate, endDate]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []); // ใช้ useEffect เพื่อรันครั้งเดียวเมื่อ component ถูก mount

  // ดึงข้อมูลบริษัทเมื่อเลือก channel (MT หรือ TT)
  useEffect(() => {
    if (channel) {
      const fetchCompanies = async () => {
        try {
          const response = await axios.get(`/PromotionProposal/api/promotion/getCompanies?channel=${channel}`);
          setCompanies(response.data.data); // เก็บข้อมูลบริษัทใน state
        } catch (err) {
          console.error('Error fetching companies:', err);
        }
      };
      fetchCompanies();
    }
  }, [channel]);

  // ดึงข้อมูลสินค้าเมื่อเลือกบริษัท
  useEffect(() => {
    if (selectedCompany) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`/PromotionProposal/api/promotion/getallproduct?CustomerCode=${selectedCompany}`);
          setProducts(response.data.data); // เก็บข้อมูลสินค้าใน state
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      };
      fetchProducts();
    }
  }, [selectedCompany]);
  useEffect(() => {
    // รีเซ็ต rowData ใน Ag-Grid เมื่อเลือกบริษัทใหม่
    if (selectedCompany) {
      setRowData([]);
    }
  }, [selectedCompany]);




  const addProductToGrid = (productCode) => {
    const product = products.find(p => p.productCode === productCode);
  
    // ตรวจสอบว่าสินค้าซ้ำหรือไม่
    const isProductAlreadyAdded = rowData.some(row => row.productCode === productCode);
  
    if (isProductAlreadyAdded) {
      Swal.fire({
        icon: 'error',
        title: 'สินค้าซ้ำ',
        text: 'ไม่สามารถเลือกสินค้าซ้ำได้',
      });
      return; // ถ้าสินค้าซ้ำจะไม่เพิ่มลงในตาราง
    }
  
    if (product) {
      const newRow = {
        productCode: product.productCode,
        productNameEng: product.productNameEng,
        price: product.price, // RSP
        packsize: product.packsize,
        GP: 0,
        Based: 0,
        Growth: 0,
        estimateSales: 0,
        wspPerCarton: 0,
        totalWsp: 0,
        compensatePcs: 0,
        avgPercent: 0, // Default AVG% เป็น 0
        discount: 0
      };
      setRowData([...rowData, newRow]);
      setRowData2([...rowData2, newRow]);
    }
  };
  
  
  
  
  // ฟังก์ชันที่ถูกแก้ไขให้ใช้ setTimeout
  const handleGPChange = (params) => {
    const gpValue = parseFloat(params.newValue || 0);
    params.data.GP = gpValue;
  
    setTimeout(() => {
      params.api.applyTransaction({ update: [params.data] });
    }, 0);
  
    return true;
  };
  
  const handleEstimateSalesChange = (params) => {
    const newValue = parseFloat(params.newValue || 0);
    params.data.estimateSales = newValue;
  
    setTimeout(() => {
      params.api.applyTransaction({ update: [params.data] });
    }, 0);
  
    return true;
  };
  
  const handleWspPerCartonChange = (params) => {
    const newValue = parseFloat(params.newValue || 0);
    params.data.wspPerCarton = newValue;
  
    setTimeout(() => {
      params.api.applyTransaction({ update: [params.data] });
    }, 0);
  
    return true;
  };
  
  const handleCompensatePcsChange = (params) => {
    const newValue = parseFloat(params.newValue || 0);
    params.data.compensatePcs = newValue;
  
    setTimeout(() => {
      params.api.applyTransaction({ update: [params.data] });
    }, 0);
  
    return true;
  };
  const handlePencenCompensateChange = (params) => {
    const newValue = parseFloat(params.newValue || 0);
    params.data.pencencompensate = newValue;
  
    setTimeout(() => {
      params.api.applyTransaction({ update: [params.data] });
    }, 0);
  
    return true;
  };
  
  const numberFormatter = (params) => {
    if (params.value == null || isNaN(params.value)) return ''; // ตรวจสอบว่าไม่มีค่าหรือไม่ใช่ตัวเลข
    return parseFloat(params.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };


  const handleRemoveStock = (productCode) => {
    if (!productCode) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'ไม่สามารถลบสินค้าได้ เนื่องจากไม่พบ Product Code',
      });
      return;
    }
  
    setRowData((prevRowData) => {
      // ลบสินค้าโดยกรอง rowData ที่มี productCode ตรงกับ productCode ที่ต้องการลบ
      const newRowData = prevRowData.filter((row) => row.productCode !== productCode);
      return newRowData;
    });
  
    Swal.fire({
      icon: 'success',
      title: 'ลบสำเร็จ',
      text: 'สินค้าถูกลบออกจากตารางแล้ว',
    });
  };
  
 
// คำนวณ BaseGrowth Head /////////////////////////////////////////////////////////////////////

const handleBaseGrowthCal = async () => {
 
  if (!branchCount) {
    Swal.fire({
      icon: 'error',
      title: 'ข้อมูลไม่ครบ',
      text: 'กรุณากรอกจำนวนสาขาที่ร่วมโปร',
    });
    return;
  }

  
  const dataToSubmit = {
    tableData: initialRowData.map(row => {
      const monthlyData = Calbasegrowth.reduce((acc, month, index) => {
        const monthKey = month.toLowerCase();
        acc[monthKey] = row[monthKey] || 0;
        acc[`${monthKey}Selected`] = selectedColumns.includes(index);
        return acc;
      }, {});

      return {
        productCode: row.productCode,
        productNameEng: row.productNameEng,
        packSize: row.packsize,
        monthlyData,
      };
    }),
    branchCount: Number(branchCount),
    selectedColumns: selectedColumns.map(index => Calbasegrowth[index]),
  };

  try {
    const response = await axios.post('/PromotionProposal/api/promotion/calbasegrowth', dataToSubmit);
    const { calculatedResults } = response.data;

    const updatedRowData = rowData.map(row => {
      const updatedResult = calculatedResults.find(result => result.productCode === row.productCode);
      if (updatedResult) {
        return {
          ...row,
          calculatedMonthlyData: updatedResult.calculatedMonthlyData,
          BasedCal: updatedResult.BasedCal,
          SumBaseGrowth: updatedResult.SumBaseGrowth,
          GrowthCal: updatedResult.GrowthCal,
        };
      }
      return row;
    });

    setRowDataBasegrowth(updatedRowData);
    setRowData(updatedRowData);

 
  } catch (error) {
    console.error('Error calculating Base&Growth:', error);
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: 'ไม่สามารถทำการคำนวณได้ กรุณาลองใหม่อีกครั้ง',
    });
  }
};

  
  const handleBaseGrowthCal2 = async () => {

    if (!branchCount) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ครบ',
        text: 'กรุณากรอกจำนวนสาขาที่ร่วมโปร',
      });
      return;
    }
  

    const dataToSubmit = {
      tableData: initialRowData2.map(row => {
        const monthlyData = Calbasegrowth2.reduce((acc, month, index) => {
          const monthKey = month.toLowerCase();
          acc[monthKey] = row[monthKey] || 0;
          acc[`${monthKey}Selected`] = selectedColumns2.includes(index);
          return acc;
        }, {});
  
        return {
          productCode: row.productCode,
          productNameEng: row.productNameEng,
          packSize: row.packsize,
          monthlyData
        };
      }),
      branchCount: Number(branchCount),
      selectedColumns: selectedColumns2.map(index => Calbasegrowth2[index])
    };
  
    try {
      const response = await axios.post('/PromotionProposal/api/promotion/calbasegrowth2', dataToSubmit);
      const { calculatedResults } = response.data;
  
      // อัปเดต `rowDataBasegrowth` และ `rowData` จาก `calculatedResults`
      const updatedRowData = rowData2.map(row => {
        const updatedResult = calculatedResults.find(result => result.productCode === row.productCode);
        if (updatedResult) {
          return {
            ...row,
            monthlyData: updatedResult.monthlyData, // อัปเดต monthlyData
            calculatedMonthlyData: updatedResult.calculatedMonthlyData,
            BasedCal2: updatedResult.BasedCal2,
            SumBaseGrowth2: updatedResult.SumBaseGrowth2,
            GrowthCal2: updatedResult.GrowthCal2
          };
        }
        return row;
      });
  
      setRowDataBasegrowth2(updatedRowData);
      setRowData2(updatedRowData);

  
     
    } catch (error) {
      console.error('Error submitting data:', error);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
      });
    }
  };
  
  // คำนวณ BaseGrowth Footer /////////////////////////////////////////////////////////////////////
  
  const handleCalculatePromo = async () => {
    const skuNumber = parseInt(skuProduct, 10);
    if (isNaN(skuNumber) || skuNumber <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'ข้อมูลไม่ถูกต้อง',
            text: 'กรุณากรอกจำนวนสินค้าใน Product SKU ที่มากกว่า 0',
        });
        return;
    }

    if (rowData.length !== skuNumber) {
        Swal.fire({
            icon: 'error',
            title: 'จำนวนสินค้าไม่ตรงกัน',
            text: `จำนวนสินค้าที่เลือกในตารางไม่ตรงกับค่าที่กรอกใน Product SKU (${skuProduct})`,
        });
        return;
    }

    const missingFields = rowData.map((row) => {
        const fields = [];
        if (!row.productCode) fields.push(`Product Code`);
        if (!row.productNameEng) fields.push(`Product Name`);
        if (!row.price) fields.push(`RSP`);
        if (!row.packsize) fields.push(`Packsize`);
        if (!row.GP) fields.push(`GP`);
        if (!row.compensatePcs) fields.push(`Compensate Pcs`);
        if (!row.pencencompensate) fields.push(`Pencencompensate`);
        return fields;
    }).flat();

    if (!branchCount) missingFields.push('จำนวนสาขาที่ร่วมโปร');
    if (!totalDays) missingFields.push('จำนวนวัน');

    if (missingFields.length > 0) {
        Swal.fire({
            icon: 'error',
            title: 'ข้อมูลไม่ครบ',
            html: `กรุณากรอกข้อมูลให้ครบในฟิลด์ต่อไปนี้:<br><br>${missingFields.join('<br>')}`,
        });
        return;
    }
    if (rowData.length > 0) {
      await handleBaseGrowthCal(); // คำนวณ Base&Growth
    }
  
    if (rowData2.length > 0) {
      await handleBaseGrowthCal2(); // คำนวณ Base&Growth2
    }

    const dataToSubmit = {
        promotionDetails: rowData.map((row) => ({
            productCode: row.productCode,
            productNameEng: row.productNameEng,
            rsp: row.price,
            packSize: row.packsize,
            base: row.Based,
            growth: row.Growth,
            pencencompensate: row.pencencompensate || 0,
            GP: row.GP,
            compensatePerPcs: row.compensatePcs,
            store_applied: Number(branchCount),
            totalDay_applied: totalDays,
        })),
    };

    console.log('Data to Submit:', dataToSubmit);

    try {
        const response = await axios.post('/PromotionProposal/api/promotion/calpromotion', dataToSubmit);
        const { calculatedResults, grandTotals } = response.data;

        console.log('API Response:', response.data);

        // อัปเดต rowData จาก calculatedResults
        const updatedRowData = rowData.map((row) => {
            const updated = calculatedResults.find((result) => result.productCode === row.productCode);
            if (updated) {
                return {
                    ...row,
                    ...updated, // อัปเดตค่าที่ได้จาก API
                    baseLine: updated.baseLine || 0,
                    growthcal: updated.growthcal || 0,
                    totalCTN: updated.totalCTN || 0,
                    totalPcs: updated.totalPcs || 0,
                    offTake: updated.offTake || 0,
                    totalBased: updated.totalBased || 0,
                    totalGrowth: updated.totalGrowth || 0,
                    grandTotal: updated.grandTotal || 0,
                    cogperunit: updated.cogperunit || 0,
                    cogBased: updated.cogBased || 0,
                    cogEstimatedGrowth: updated.cogEstimatedGrowth || 0,
                };
            }
            return row;
        });

        setRowData(updatedRowData);
        setGrandRowData(grandTotals);
        setIsPromoCalculated(true); // ตั้งสถานะเมื่อคำนวณสำเร็จ
        Swal.fire({
            icon: 'success',
            title: 'คำนวณสำเร็จ',
            text: 'การคำนวณโปรโมชั่นเสร็จสิ้นและอัปเดตข้อมูลเรียบร้อยแล้ว!',
        });
    } catch (error) {
        console.error('Error calculating promotion:', error);
        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: 'ไม่สามารถทำการคำนวณได้ กรุณาลองใหม่อีกครั้ง',
        });
    }
};
  


  const handleSubmitToAddPromotion = async () => {

    if (!isPromoCalculated) {
      Swal.fire({
        icon: 'warning',
        title: 'ยังไม่ได้คำนวณ',
        text: 'กรุณากดปุ่ม "คำนวณ" ก่อนส่งข้อมูล',
      });
      return;
    }

    
    setLoading(true);
    try {

      
        // สร้างฟังก์ชันสำหรับรวมข้อมูล rowData และ rowData2
        const mergePromotionData = () => {
            // สร้าง Map เพื่อเก็บข้อมูลที่รวมแล้วโดยใช้ productCode เป็น key
            const mergedDataMap = new Map();

            // รวมข้อมูลจาก rowData
            rowData.forEach(row => {
                const baseGrowthData = rowDataBasegrowth.find(
                    baseGrowth => baseGrowth.productCode === row.productCode
                ) || {};

                const monthlyDataSelected = Calbasegrowth.reduce((acc, month, index) => {
                    const monthKey = month.toLowerCase();
                    acc[`${monthKey}Selected`] = selectedColumns.includes(index);
                    return acc;
                }, {});

                mergedDataMap.set(row.productCode, {
                    ...row,
                    CustomerCode: selectedCompany || "Unknown",
                    productCode: row.productCode || "Unknown",
                    productNameEng: row.productNameEng || "",
                    compensatePerPcs: row.compensatePcs || 0,
                    growthcal: row.growthcal || 0,
                    discount: row.discount || 0,
                    totalCTN: row.totalCTN || 0,
                    totalPcs: row.totalPcs || 0,
                    offTake: row.offTake || 0,
                    totalWsp: row.totalWsp || 0,
                    wspPerCarton: row.wspPerCarton || 0,
                    rsp: row.price || 0,
                    packSize: row.packsize || 0,
                    base: row.Based || 0,
                    growth: row.Growth || 0,
                    baseLine: row.baseLine || 0,
                    avgPercent: row.avgPercent || 0,
                    GP: row.GP || 0,
                    totalBased: row.totalBased || 0,
                    totalGrowth: row.totalGrowth || 0,
                    grandTotal: row.grandTotal || 0,
                    pencencompensate: row.pencencompensate || 0,
                    store_applied: Number(branchCount) || 0,
                    totalDay_applied: totalDays || 0,
                    cogperunit: row.cogperunit || 0,
                    cogBased: row.cogBased || 0,
                    cogEstimatedGrowth: row.cogEstimatedGrowth || 0,
                    // ข้อมูลเดือนแรก
                    jan: baseGrowthData.jan || "0.00",
                    feb: baseGrowthData.feb || "0.00",
                    mar: baseGrowthData.mar || "0.00",
                    apr: baseGrowthData.apr || "0.00",
                    may: baseGrowthData.may || "0.00",
                    jun: baseGrowthData.jun || "0.00",
                    jul: baseGrowthData.jul || "0.00",
                    aug: baseGrowthData.aug || "0.00",
                    sep: baseGrowthData.sep || "0.00",
                    oct: baseGrowthData.oct || "0.00",
                    nov: baseGrowthData.nov || "0.00",
                    dec: baseGrowthData.dec || "0.00",
                    BasedCal: baseGrowthData.BasedCal || "0.00",
                    GrowthCal: baseGrowthData.GrowthCal || "0.00",
                    SumBaseGrowth: baseGrowthData.SumBaseGrowth || "0.00",
                    ...monthlyDataSelected,
                    calculatedMonthlyData: baseGrowthData.calculatedMonthlyData || {},
                });
            });

            // รวมข้อมูลจาก rowData2
            rowData2.forEach(row => {
                const baseGrowthData2 = rowDataBasegrowth2.find(
                    baseGrowth => baseGrowth.productCode === row.productCode
                ) || {};

                const monthlyDataSelected2 = Calbasegrowth2.reduce((acc, month, index) => {
                    const monthKey = `${month.toLowerCase()}2`;
                    acc[`${monthKey}Selected`] = selectedColumns2.includes(index);
                    return acc;
                }, {});

                const existingData = mergedDataMap.get(row.productCode) || {};
                
                mergedDataMap.set(row.productCode, {
                    ...existingData,
                    // เพิ่มข้อมูลเดือนที่สอง
                    jan2: baseGrowthData2.monthlyData?.jan22 || "0.00",
                    feb2: baseGrowthData2.monthlyData?.feb22 || "0.00",
                    mar2: baseGrowthData2.monthlyData?.mar22 || "0.00",
                    apr2: baseGrowthData2.monthlyData?.apr22 || "0.00",
                    may2: baseGrowthData2.monthlyData?.may22 || "0.00",
                    jun2: baseGrowthData2.monthlyData?.jun22 || "0.00",
                    jul2: baseGrowthData2.monthlyData?.jul22 || "0.00",
                    aug2: baseGrowthData2.monthlyData?.aug22 || "0.00",
                    sep2: baseGrowthData2.monthlyData?.sep22 || "0.00",
                    oct2: baseGrowthData2.monthlyData?.oct22 || "0.00",
                    nov2: baseGrowthData2.monthlyData?.nov22 || "0.00",
                    dec2: baseGrowthData2.monthlyData?.dec22 || "0.00",
                    BasedCal2: baseGrowthData2.BasedCal2 || "0.00",
                    GrowthCal2: baseGrowthData2.GrowthCal2 || "0.00",
                    SumBaseGrowth2: baseGrowthData2.SumBaseGrowth2 || "0.00",
                    ...monthlyDataSelected2,
                    calculatedMonthlyData2: baseGrowthData2.calculatedMonthlyData || {},
                });
            });

            // แปลง Map กลับเป็น Array
            return Array.from(mergedDataMap.values());
        };

        // ใช้ฟังก์ชันรวมข้อมูล
        const promotionDetails = mergePromotionData();

        // สร้างข้อมูลที่ต้องการส่งไปยัง API
        const dataToSubmit = {
            remark,
            detailpromotion,
            accountOpeningFee,
            listingFee,
            systemCost,
            placementFee,
            electricityFee,
            focfreeicecreamFee,
            focsupportFee,
            otherCosts,
            storeSize,
            startDate,
            endDate,
            baseGrowthstartDate,
            baseGrowthendDate,
            storeSizeMapped,
            totalDays,
            branchCount,
            currentDate,
            selectedCompany,
            promotionTitle,
            promotionType,
            grandTotals: grandrowData,
            usercode: authUser.usercode,
            promotionDetails, // ส่งข้อมูลที่รวมแล้ว
        };

        // console.log("Data to Submit:", JSON.stringify(dataToSubmit, null, 2));

        // ส่งข้อมูลไปยัง API
        const response = await axios.post(
          "/PromotionProposal/api/promotion/addpromotion",
          dataToSubmit
        );

        Swal.fire({
            icon: "success",
            title: "ส่งข้อมูลสำเร็จ",
            text: "ข้อมูลได้ถูกส่งบันทึกเรียบร้อย",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate("/PromotionProposal/homepage");
            }
        });
    } catch (error) {
        console.error("Error submitting form:", error);
        Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        });
    } finally {
        setLoading(false);
    }
};
  
  
  
  
  
  
  

  const validateDecimal = (value) => {
    const decimalRegex = /^\d+(\.\d{2})?$/; // ตรวจสอบให้เป็นจุดทศนิยม 2 ตำแหน่ง
    return decimalRegex.test(value);
  };
  
  const [columnDefs] = useState([
    { headerName: "Product Code", field: "productCode", editable: false },
    { headerName: "Product Name", field: "productNameEng", editable: false },
    { headerName: "RSP", field: "price", editable: false, valueFormatter: numberFormatter },
    { headerName: "Packsize", field: "packsize", editable: false, valueFormatter: numberFormatter },
    { 
        headerName: "Sale Price", 
        field: "salePrice", 
        editable: true, 
        cellStyle: { backgroundColor: '#A7E7EF' },
        valueSetter: (params) => {
            const newValue = parseFloat(params.newValue || 0);
            if (isNaN(newValue)) {
                params.data.salePrice = 0.00;
            } else {
                params.data.salePrice = newValue;
            }
            // คำนวณค่า compensatePcs อัตโนมัติ (RSP - Sale Price)
            const rsp = parseFloat(params.data.price || 0);
            params.data.compensatePcs = rsp - params.data.salePrice;
            
            // รีเฟรชเซลล์เพื่ออัพเดทค่า compensatePcs
            params.api.refreshCells({
                columns: ['compensatePcs'],
                rowNodes: [params.node]
            });
            return true;
        },
        valueFormatter: (params) => params.value ? parseFloat(params.value).toFixed(2) : '0.00',
        initialValue: 0.00
    },
    { headerName: "GP", field: "GP", editable: true, cellStyle: { backgroundColor: '#A7E7EF' },
        valueSetter: (params) => {
            const newValue = parseFloat(params.newValue || 0);
            const api = params.api;
            if (isNaN(newValue)) {
                return false;
            }
            api.forEachNode((node) => {
                node.data.GP = newValue;
            });
            api.refreshCells({ force: true });
            return true;
        },
        valueFormatter: numberFormatter,
    },
    { headerName: "Based", field: "Based", editable: true, cellStyle: { backgroundColor: '#A7E7EF' },
        valueSetter: (params) => {
            const value = parseFloat(params.newValue);
            if (isNaN(value)) {
                params.data.Based = '0.00';
            } else {
                params.data.Based = value.toFixed(2);
            }
            return true;
        },
        valueFormatter: (params) => params.value ? parseFloat(params.value).toFixed(2) : '0.00',
        headerTooltip: 'ยอดขายปกติ',
    },
    { headerName: "Growth", field: "Growth", editable: true, cellStyle: { backgroundColor: '#A7E7EF' },
        valueSetter: (params) => {
            const value = parseFloat(params.newValue);
            if (isNaN(value)) {
                params.data.Growth = '0.00';
            } else {
                params.data.Growth = value.toFixed(2);
            }
            return true;
        },
        valueFormatter: (params) => params.value ? parseFloat(params.value).toFixed(2) : '0.00',
        headerTooltip: 'ยอดขายกิจกรรม',
    },
    { headerName: "Estimate Sales (CTN)", field: "estimateSales", editable: false,
        valueSetter: handleEstimateSalesChange,
        valueFormatter: numberFormatter,
    },
    { headerName: "WSP / Carton (Ex. Vat)", field: "wspPerCarton", editable: false,
        valueSetter: handleWspPerCartonChange,
        valueFormatter: numberFormatter,
    },
    { headerName: "Total WSP (Ex. Vat)", field: "totalWsp", editable: false, valueFormatter: numberFormatter },
    { headerName: "COMPENSATE / Pcs.", field: "compensatePcs", editable: false,
        valueFormatter: numberFormatter,
    },
    { 
        headerName: "COMPENSATE %", 
        field: "pencencompensate", 
        editable: true,
        cellStyle: { backgroundColor: '#A7E7EF' },
        valueSetter: (params) => {
            const value = parseFloat(params.newValue);
            if (isNaN(value)) {
                params.data.pencencompensate = 0;
            } else {
                // เก็บค่าเป็นตัวเลขล้วนๆ ไม่มี %
                params.data.pencencompensate = value;
            }
            return true;
        },
        // แสดงผลเป็น % แต่ค่าที่เก็บเป็นตัวเลขล้วนๆ
        valueFormatter: (params) => params.value ? `${params.value} %` : '0 %',
    },
    { headerName: "Avg. %", field: "avgPercent", editable: false, valueFormatter: numberFormatter },
    { headerName: "%Discount", field: "discount", editable: false,
        valueFormatter: (params) => `${numberFormatter(params)}%`,
    },
    { field: 'actions', headerName: '', cellRenderer: 'buttonRenderer',
        cellRendererParams: {
            onClick: (e) => handleRemoveStock(e.data.id),
        },
        width: 90,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    },
]);


  const promotionColumnCal = useMemo(
    () => [
      {
        field: 'baseLine',
        headerName: 'baseLine',
        width: 100,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'growthcal',
        headerName: 'Growth',
        width: 200,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'totalCTN',
        headerName: 'totalCTN',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'totalPcs',
        headerName: 'totalPcs',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'offTake',
        headerName: 'offTake',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'totalBased',
        headerName: 'totalBased',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'totalGrowth',
        headerName: 'totalGrowth',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'grandTotal',
        headerName: 'grandTotal',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'cogperunit',
        headerName: 'cogperunit',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'cogBased',
        headerName: 'cogBased',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
      {
        field: 'cogEstimatedGrowth',
        headerName: 'cogEstimatedGrowth',
        width: 150,
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
      },
    ],
    []
  );
  const gridOptions = useMemo(
    () => ({
      defaultColDef: {
        resizable: false,
        sortable: true,
        filter: true,
      },
      pagination: false,
      paginationPageSize: 10, // กำหนดขนาดหน้าที่รองรับ
    paginationPageSizeSelector: [10, 20, 50], // เพิ่มตัวเลือกขนาดหน้า
      rowHeight: 60,
      suppressMovableColumns
  : true,
      components: {
        buttonRenderer: (params) => (
          <IconButton onClick={() => handleRemoveStock(params.data.productCode)}>
            <MdDelete />
          </IconButton>
        ),
      },
    }),
    []
  );
  
  const onGridReady = useCallback((params) => {
    gridApiRef.current = params.api;
  
    // ตั้งค่าเริ่มต้นให้กับทุกแถว ถ้ายังไม่มีค่า Based หรือ Growth
    params.api.forEachNode((node) => {
      if (!node.data.Based) node.data.Based = '0.00';
      if (!node.data.Growth) node.data.Growth = '0.00';
    });
  
    // รีเฟรชเซลล์ทั้งหมดเพื่อแสดงผลค่าใหม่
    params.api.refreshCells({ force: true });
  
    // ปรับขนาดคอลัมน์ให้พอดีกับขนาดตาราง
    params.api.sizeColumnsToFit();
  }, []);
  
  
  return (
    <div className="w-full min-h-screen bg-white border rounded-lg shadow-xl p-6">
      <Backdrop
sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
open={loading}
>
<CircularProgress color="inherit" />
</Backdrop>
      {/* Header */}
      <h2 className="text-2xl font-bold mb-4">Promotion Proposal / แบบฟอร์มขอโปรโมชั่น</h2>

      {/* Section A - Customer Information */}
      <section className="border-b-2 pb-4 mb-6">
        <h3 className="font-bold text-gray-800 mb-2">CUSTOMER INFORMATION / รายละเอียดลูกค้า</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium ">Promotion No.</label>
            <input type="text" readOnly className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-not-allowed bg-gray-200"  />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Request Date</label>
            <input
              type="date"
              value={currentDate}  // แสดงวันที่ปัจจุบัน
              readOnly  // ปิดการแก้ไข
              className="mt-1 p-2 block w-full border rounded-md focus:outline-none  cursor-not-allowed bg-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Promotion Title
            <span className="text-red-500">*</span>
            </label>
            <input type="text" 
            onChange={(e) => setPromotionTitle(e.target.value)} 
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Promotion Type <span className="text-red-500">*</span></label>
            <input type="text" 
            onChange={(e) => setPromotionType(e.target.value)}
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Channel <span className="text-red-500">*</span></label>
            <select
              className='w-40 border h-8 rounded-md'
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="">เลือก Channel</option>
              <option value="MT">MT</option>
              <option value="TT">TT</option>
            </select>
          </div>

          <div>
  <label className="block text-gray-700 font-medium">Customer <span className="text-red-500">*</span></label>
  <select
    className='w-40 border h-8 rounded-md'
    value={selectedCompany}
    onChange={(e) => setSelectedCompany(e.target.value)}
    disabled={!channel}
  >
    {channel === 'TT' ? (
      <option value="">เลือกช่องทาง</option>
    ) : (
      <option value="">เลือก Customer</option>
    )}
    {companyOptions}
  </select>
</div>
        </div>
      </section>

{/* Section B.1 - เลือกวัน */}
<section className="border-b-2 pb-4 mb-6">
  <h3 className="font-bold text-gray-800 mb-2">PROMOTION ITEM / รายการสินค้าในโปรโมชั่น</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-gray-700 font-medium">Promotion Period / ระยะเวลาโปรโมชั่น</label>
      <div className="flex flex-wrap space-x-0 md:space-x-4">
        <div className="w-full md:w-auto mb-2 md:mb-0">
          <label>Start/วันเริ่ม <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={handleStartDateChange}
           
          />
        </div>
        <div className="w-full md:w-auto">
          <label>To/ถึง <span className="text-red-500">*</span></label>
          <input
            type="date"
            className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate} 
            disabled={!startDate} 
          />
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-4 md:flex-row md:gap-6">
      <div className="w-full md:w-28">
        <label className="block text-gray-700 font-medium">จำนวนวัน</label>
        <input
          type="text"
          className="mt-1 p-2 block w-full border rounded-md focus:outline-none bg-gray-200 cursor-not-allowed"
          value={totalDays}
          readOnly // ปิดไม่ให้พิมพ์แก้ไขได้
        />
      </div>
      <div className="w-full md:w-64">
        <label className="block text-gray-700 font-medium">จำนวนสาขาที่ร่วมโปร <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="branchCount"
          value={branchCount}
          onChange={(e) => setBranchCount(e.target.value)}
          className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full md:w-44">
        <label className="block text-gray-700 font-medium">Product SKU <span className="text-red-500">*</span></label>
        <input
          type="text"
          name="skuProduct"
          value={skuProduct}
          onChange={(e) => setSkuProduct(e.target.value)}
          className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="w-full md:w-52">
        <label className="block text-gray-700 font-medium">ตู้แช่ <span className="text-red-500">*</span></label>
        <select
          value={storeSize}
          onChange={(e) => {
            const selectedValue = e.target.value || "";
            setStoreSize(selectedValue);
            let mappedValue;
            switch (selectedValue) {
              case "1.2M":
                mappedValue = 200;
                break;
              case "1M":
                mappedValue = 100;
                break;
              case "80M":
                mappedValue = 95;
                break;
              default:
                mappedValue = "";
                break;
            }
            setStoreSizeMapped(mappedValue);
          }}
          className="w-full border h-8 mt-1 rounded-md focus:outline-none"
        >
          <option value="">เลือกขนาดตู้แช่</option>
          <option value="1.2M">ตู้ 1.2M</option>
          <option value="1M">ตู้ 1M</option>
          <option value="80M">ตู้ 80M</option>
          <option value="ตู้รวม">ตู้ห้าง ตู้รวม</option>
          <option value="MixBrand">ตู้ห้าง Mix Brand</option>
        </select>
      </div>
    </div>
  </div>
</section>


    {/* Section B.2 - Promotion Item */}
    <section className="border-b-2 pb-2 mb-6 relative z-50 bg-white">
      <div className='w-80 pb-4'>
        
        <Select
          options={productOptions}
          onChange={handleProductChange}
          placeholder="ค้นหาสินค้า..."
          isDisabled={!selectedCompany}
          filterOption={filterOption}
        />
      </div>
    </section>

    <div className="mb-4">
    <button
  onClick={toggleSectionVisibility}
  className="p-2 bg-orange-500 text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-orange-400"
>
  {showSection ? 'ซ่อน' : 'แสดง ตารางคำนวณ Base&Growth'}
</button>
</div>
{showSection && (
  <section className='mb-6'>
      <label className="block text-blue-500 font-medium text-xl">ข้อมูลยอดขายย้อนหลัง</label>
        <div className="flex space-x-4 mb-4">
            <div>
              <label>วันเริ่ม</label>
              <input
                type="date"
                className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={baseGrowthstartDate}
                onChange={handlebaseGrowthStartDateChange}
              />
            </div>
            <div>
              <label>ถึง</label>
              <input
                type="date"
                className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={baseGrowthendDate}
                onChange={handlehandlebaseGrowthEndDateChange}
                min={baseGrowthstartDate} 
                disabled={!baseGrowthstartDate} 
              />
            </div>
          </div>
   <TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        {Calbasegrowth.map((column, index) => (
          <TableCell key={column}>
            {index > 1 && (
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
      {rowData.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {Calbasegrowth.map((column, colIndex) => (
            <TableCell
              key={`${rowIndex}-${colIndex}`}
              style={{
                backgroundColor: selectedColumns.includes(colIndex) ? '#fff635' : 'white',
              }}
            >
              {colIndex === 0 ? (
                row.productNameEng
              ) : colIndex === 1 ? (
                row.packsize
              ) : (
                <input
                  type="text"
                  value={row[column.toLowerCase()] || ''}
                  onChange={(e) => handleInputChange(e, rowIndex, colIndex)}
                  style={{ width: '100%', border: 'none', outline: 'none' }}
                />
              )}
            </TableCell>
          ))}
          <TableCell>
            <button
              onClick={() => handleRemoveRow(rowIndex)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              ลบ
            </button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


    {rowDataBasegrowth.length > 0 && (
  <section className="ag-theme-alpine mt-4 mb-2" style={{ height: 300, width: '100%' }}>
    <AgGridReact
      rowData={rowDataBasegrowth}
      columnDefs={CalbasegrowthColumns}
      gridOptions={gridOptions}
      onGridReady={onGridReady}
    />
  </section>
)}


    <div className="flex justify-end items-center align-middle mb-4">
      <button
        onClick={handleBaseGrowthCal}
        className="mt-4 p-2 bg-green-500 text-white rounded-md transition-transform duration-200 hover:scale-105 hover:bg-green-400"
      >
        คำนวณ Based&Growth
      </button>
    </div>
    <div className="mb-4">
    <button
  onClick={toggleSectionVisibility2}
  className="p-2 bg-orange-500 text-white rounded-md font-semibold transition-transform duration-200 hover:scale-105 hover:bg-orange-400"
>
  
  {showSection2 ? 'ซ่อน' : 'แสดง ตารางคำนวณ Base&Growth2'}
</button>
</div>
{showSection2 && (
  <section className='mb-6'>
<TableContainer component={Paper}>
  <Table>
    <TableHead>
      <TableRow>
        {Calbasegrowth2.map((column, index) => (
          <TableCell key={column}>
            {index > 1 && (
              <Checkbox
                checked={selectedColumns2.includes(index)} // ใช้ selectedColumns2
                onChange={() => handleColumnCheckboxChange2(index)} // เรียกฟังก์ชัน handleColumnCheckboxChange2
              />
            )}
            {column}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
      {rowData2.map((row, rowIndex) => (
        <TableRow key={rowIndex}>
          {Calbasegrowth2.map((column, colIndex) => (
            <TableCell
              key={`${rowIndex}-${colIndex}`}
              style={{
                backgroundColor: selectedColumns2.includes(colIndex) ? '#fff635' : 'white', // ใช้ selectedColumns2 สำหรับสี
              }}
            >
              {colIndex === 0 ? (
                row.productNameEng
              ) : colIndex === 1 ? (
                row.packsize
              ) : (
                <input
                  type="text"
                  value={row[column.toLowerCase()] || ''} // ใช้ key ของ rowData2
                  onChange={(e) => handleInputChange2(e, rowIndex, colIndex)} // เรียก handleInputChange2
                  style={{ width: '100%', border: 'none', outline: 'none' }}
                />
              )}
            </TableCell>
          ))}
          <TableCell>
            <button
              onClick={() => handleRemoveRow(rowIndex)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '5px',
                cursor: 'pointer',
              }}
            >
              ลบ
            </button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>




    {rowDataBasegrowth2.length > 0 && (
  <section className="ag-theme-alpine mt-4 mb-2" style={{ height: 300, width: '100%' }}>
    <AgGridReact
      rowData={rowDataBasegrowth2}
      columnDefs={CalbasegrowthColumns2}
      gridOptions={gridOptions}
      onGridReady={onGridReady}
    />
  </section>
)}


    <div className="flex justify-end items-center align-middle mb-4">
      <button
        onClick={handleBaseGrowthCal2}
        className="mt-4 p-2 bg-green-500 text-white rounded-md transition-transform duration-200 hover:scale-105 hover:bg-green-400"
      >
        คำนวณ Based&Growth
      </button>
    </div>
  </section>
)}
  </section>
)}

<div className="mb-2">
  <div className="text-xs text-red-500 bg-red-50 p-2 rounded-md mb-2 border border-red-200">
    <span className="font-medium">หมายเหตุ: Base Sale</span> (หน่วย/ชิ้น) ยอดขายปกติในช่วงที่ไม่มีการจัดโปรโมชั่น : จำนวนชิ้น ต่อสาขา ต่อวัน (โดยอ้างอิงจากยอดขายเฉลี่ยย้อนหลัง เช่น 1-6 เดือนย้อนหลัง)
  </div>
  <div className="text-xs text-red-500 bg-red-50 p-2 rounded-md border border-red-200">
    <span className="font-medium">หมายเหตุ: Estimate Growth Sale</span> (หน่วย/ชิ้น) ยอดขายที่คาดว่าจะเกิดขึ้นในช่วงระยะเวลาจัดโปรโมชั่น : จำนวนชิ้น ต่อสาขา ต่อวัน (โดยประเมินจากเป้าหมายการเติบโตของยอดขายที่เกิดจากโปรโมชั่น เช่น ส่วนลด หรือกิจกรรมส่งเสริมการขาย อาจอ้างอิงจากประวัติการจัดโปรโมชั่นก่อนหน้า หรือ Benchmark ของสินค้าคล้ายกันในช่วงเวลาเดียวกัน)
  </div>
</div>
      {/* Ag-Grid Table ตารางหลัก */}
      <section className="ag-theme-alpine" style={{ height: 600, width: '100%' , overflow: 'auto' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          onGridReady={onGridReady}
          defaultColDef={{ flex: 1, resizable: true }}
          
        />
      </section>
          <div className=' flex justify-end items-center align-middle'>
            <button onClick={handleCalculatePromo} className="mt-4 p-2 bg-blue-500 text-white rounded-md transition-transform duration-200 hover:scale-105 hover:bg-blue-400">
              คำนวณ
            </button>
          </div>



      {/* Ag-Grid Table Calculate*/}


      {showPromotionCalGrid && (
            <div className='flex w-full justify-start bg-gray-100 h-2/3 p-4 shadow-2xl rounded-xl mt-8'>
              <div className='ag-theme-alpine w-full h-full' style={{ overflowX: 'auto' }}>
                <div className='ag-theme-alpine h-[400px] w-[520px] md:w-full overflow-y-auto shadow-2xl'>
                  <AgGridReact
                    rowData={rowData}
                    columnDefs={promotionColumnCal}
                    gridOptions={gridOptions}
                    onGridReady={onGridReady}
                  />
                </div>
              </div>
            </div>
          )}

       {/* Additional Costs */}
<section className="border-b-2 pb-4 mb-6">
  <h4 className="text-sm text-gray-600 mb-2">ค่าใช้จ่ายเพิ่มเติม</h4>
  <div className="grid grid-cols-6 gap-4">
    {/* แถวที่มีป้ายกำกับและ input */}
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.1 ค่าเปิดหน้าบัญชี</div>
      <input 
        type="text" 
        value={accountOpeningFee} 
        onChange={(e) => setaccountOpeningFee(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.2 Listing Fee</div>
      <input 
        type="text" 
        value={listingFee} 
        onChange={(e) => setListingFee(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.3 ค่าระบบ</div>
      <input 
        type="text" 
        value={systemCost} 
        onChange={(e) => setsystemCost(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.4 ค่าวางสินค้า</div>
      <input 
        type="text" 
        value={placementFee} 
        onChange={(e) => setplacementFee(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.5 ค่าไฟ</div>
      <input 
        type="text" 
        value={electricityFee} 
        onChange={(e) => setelectricityFee(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.6 ไอศกรีมฟรี FOC</div>
      <input 
        type="text" 
        value={focfreeicecreamFee} 
        onChange={(e) => setfocfreeicecreamFee(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.7 สนับสนุน FOC</div>
      <input 
        type="text" 
        value={focsupportFee} 
        onChange={(e) => setFocsupportFee(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
    <div className="flex flex-col">
      <div className="h-8 flex items-center text-sm">4.8 อื่นๆ</div>
      <input 
        type="text" 
        value={otherCosts} 
        onChange={(e) => setOtherCosts(e.target.value)} 
        className="h-8 mt-1 p-1 block w-full border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />
    </div>
  </div>
</section>




      {/* Mechanic Promotion */}
      <section className="border-b-2 pb-4 mb-6">
        <h4 className="text-md text-gray-600 mb-2">Mechanic Promotion / รายละเอียดโปรโมชั่น (Text 50 word)</h4>
        <input
        value={detailpromotion}
        onChange={(e) => setDetailPromotion(e.target.value)} 
          className="mt-1 p-2 block w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        />
      </section>


      {/* Review & Approval */}
      <section className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 font-medium">Requestor</label>
          <input type="text" className="mt-1 p-2 block w-full border rounded-md focus:outline-none cursor-pointer" value={authUser.nameEng} readOnly />
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

      <div className='mt-14 mb-4 flex justify-center gap-20'>
  <h1>เหตุผล</h1>
  <textarea
  value={remark}
  onChange={(e) => setRemark(e.target.value)} 
    className="mt-1 p-2 block w-full h-32 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    style={{ textAlign: 'left', verticalAlign: 'top' }}
  />
</div>

      {/* Submit & Return */}
      <div className="flex justify-end gap-4">
      <button onClick={handleSubmitToAddPromotion} className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-blue-600">
        Submit
      </button>
        <button className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-600">
          Return
        </button>
      </div>
    </div>
  );
}



