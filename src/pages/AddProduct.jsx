import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../hooks/use-auth';
import { AgGridReact } from 'ag-grid-react';
import { MdCancel } from 'react-icons/md';
import { FaRedo } from "react-icons/fa";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles.css';

export default function AddProduct() {
  const { authUser } = useAuth();

  // ตรวจสอบสิทธิ์ผู้ใช้
  const isAuthorized = authUser.role_code === 'ADMIN' || authUser.role_code === 'Approved_Step2' || authUser.role_code === 'Approved_Step1';

  const [product, setProduct] = useState({
    productCode: '',
    productNameEng: '',
    productNameThai: '',
    packsize: '',
    price: '',
    CustomerCode: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companySearchTerm, setCompanySearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [companyOptions, setCompanyOptions] = useState([]);
  const dropdownRef = useRef(null);
  const companyDropdownRef = useRef(null);

  const [selectedCompany, setSelectedCompany] = useState(''); 
  const [products, setProducts] = useState([]);
  const [channel, setChannel] = useState(''); 
  const [rowData, setRowData] = useState([]);
  const [companies, setCompanies] = useState([]); 
  const [isLoading, setIsLoading] = useState(false);
  const [customerData, setCustomerData] = useState({
    channel: '',
    companyName: '',
  });

  const [modifyProductRowData, setModifyProductRowData] = useState([]);
  
  const handletoggleProductStatus = async (productCode, customerCode, isActive) => {
    const actionText = isActive ? 'ลบ' : 'เพิ่ม';
  
    Swal.fire({
      title: `ยืนยันการ${actionText}สินค้า?`,
      text: `คุณต้องการ${actionText}สินค้ารหัส ${productCode} ใช่หรือไม่`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `ใช่, ${actionText}สินค้า`,
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.patch('/PromotionProposal/api/promotion/toggleProductStatus', {
            productCode,
            CustomerCode: customerCode,
            actionBy: authUser.nameEng
          });
  
          if (response.data.status === 'success') {
            Swal.fire(
              `${actionText}สำเร็จ`,
              `สินค้ารหัส ${productCode} ถูก${actionText}เรียบร้อย`,
              'success'
            );
  
            setRowData(prevRowData => 
              prevRowData.map(product =>
                product.productCode === productCode && product.CustomerCode === customerCode
                  ? { ...product, isActive: !isActive }
                  : product
              )
            );
  
            setModifyProductRowData(prevModifyProductRowData =>
              prevModifyProductRowData.map(product =>
                product.productCode === productCode && product.CustomerCode === customerCode
                  ? { ...product, isActive: !isActive, modifyDate: new Date().toISOString() }
                  : product
              )
            );
  
          } else {
            Swal.fire('เกิดข้อผิดพลาด', response.data.message || `ไม่สามารถ${actionText}สินค้าได้`, 'error');
          }
        } catch (error) {
          Swal.fire('เกิดข้อผิดพลาด', error.response?.data?.message || `ไม่สามารถ${actionText}สินค้าได้`, 'error');
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const columnDefs = [
    { headerName: 'รหัสสินค้า', field: 'productCode', sortable: true, filter: true, flex: 1 },
    { headerName: 'ชื่อสินค้า (อังกฤษ)', field: 'productNameEng', sortable: true, filter: true, flex: 1 },
    { headerName: 'ชื่อสินค้า (ไทย)', field: 'productNameThai', sortable: true, filter: true, flex: 1 },
    { headerName: 'ขนาดบรรจุ', field: 'packsize', sortable: true, filter: true, flex: 1 },
    { headerName: 'ราคา', field: 'price', sortable: true, filter: true, flex: 1 },
    {
      field: 'action',
      headerName: '',
      width: 60,
      cellRenderer: params => {
        if (params.data.isActive) {
          return (
            <div
              onClick={() => handletoggleProductStatus(params.data.productCode, params.data.CustomerCode, params.data.isActive)}
              className="flex justify-center items-center cursor-pointer hover:text-red-300 transition-colors duration-200 text-red-500"
            >
              <MdCancel size={25} />
            </div>
          );
        } else {
          return (
            <div
              onClick={() => handletoggleProductStatus(params.data.productCode, params.data.CustomerCode, params.data.isActive)}
              className="flex justify-center items-center cursor-pointer hover:text-green-300 transition-colors duration-200 text-green-500"
            >
              <FaRedo size={25} />
            </div>
          );
        }
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    }
  ];

  const productDefs = useMemo(() => [
    { headerName: 'รหัสสินค้า', field: 'productCode', sortable: true, filter: true, flex: 1 },
    { headerName: 'ชื่อสินค้า (อังกฤษ)', field: 'productNameEng', sortable: true, filter: true, flex: 1 },
    { headerName: 'ชื่อสินค้า (ไทย)', field: 'productNameThai', sortable: true, filter: true, flex: 1 },
    { headerName: 'ชื่อบริษัท', field: 'Customer.companyName', sortable: true, filter: true, flex: 1 },
    { 
      headerName: 'สถานะสินค้า', 
      field: 'productstatus', 
      sortable: true, 
      filter: true, 
      flex: 1,
      valueFormatter: (params) => {
        if (params.value === 'Added') {
          return 'เพิ่มสินค้า';
        } else if (params.value === 'Deleted') {
          return 'ลบสินค้า';
        }
        return params.value || '';
      }
    },
    { 
      headerName: 'วันที่แก้ไข', 
      field: 'modifyDate', 
      sortable: true, 
      filter: true, 
      flex: 1,
      valueFormatter: (params) => {
        if (!params.value) return '';
        const date = new Date(params.value);
        date.setHours(date.getHours() - 7);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}.${minutes}`;
      }
    },
    { headerName: 'ผู้กระทำการ', field: 'actionBy', sortable: true, filter: true, flex: 1 },
    {
      field: 'action',
      headerName: '',
      width: 60,
      cellRenderer: params => {
        if (!params.data.isActive) {
          return (
            <div
              onClick={() => handletoggleProductStatus(params.data.productCode, params.data.CustomerCode, params.data.isActive)}
              className="flex justify-center items-center cursor-pointer hover:text-green-300 transition-colors duration-200 text-green-500"
            >
              <FaRedo size={25} />
            </div>
          );
        }
        return null;
      },
      cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' }
    }
  ], []);

  useEffect(() => {
    if (channel) {
      const fetchCompanies = async () => {
        try {
          const response = await axios.get(`/PromotionProposal/api/promotion/getCompanies?channel=${channel}`);
          setCompanies(response.data.data);
        } catch (err) {
          console.error('Error fetching companies:', err);
        }
      };
      fetchCompanies();
    }
  }, [channel]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/PromotionProposal/api/promotion/getallproducts');
        const uniqueProducts = Array.from(new Set(response.data.data.map(product => product.productCode)))
          .map(code => {
            const product = response.data.data.find(prod => prod.productCode === code);
            return {
              value: product.productCode,
              label: `${product.productNameEng} (${product.productCode})`,
              productNameThai: product.productNameThai,
              packsize: product.packsize,
              price: product.price
            };
          });
        setProductOptions(uniqueProducts);
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้า:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchModifiedProducts = async () => {
      try {
        const response = await axios.get('/PromotionProposal/api/promotion/getmodifyProducts');
        setModifyProductRowData(response.data.data);
      } catch (error) {
        console.error('Error fetching modified products:', error);
      }
    };
    fetchModifiedProducts();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      const cachedData = localStorage.getItem('cachedCompanies');
      const cachedTimestamp = localStorage.getItem('cachedTimestamp');
      const cacheDuration = 5 * 60 * 1000;
  
      if (cachedData && cachedTimestamp && (Date.now() - cachedTimestamp < cacheDuration)) {
        setCompanyOptions(JSON.parse(cachedData));
      } else {
        try {
          const response = await axios.get('/PromotionProposal/api/promotion/getallCompany');
          const companies = response.data.data.map(company => ({
            value: company.CustomerCode,
            label: company.companyName,
            CustomerCode: company.CustomerCode,
          }));
          
          localStorage.setItem('cachedCompanies', JSON.stringify(companies));
          localStorage.setItem('cachedTimestamp', Date.now());
          
          setCompanyOptions(companies);
        } catch (error) {
          console.error('เกิดข้อผิดพลาดในการดึงข้อมูลบริษัท:', error);
        }
      }
    };
    fetchCompanies();
  }, []);
  
  useEffect(() => {
    if (selectedCompany) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`/PromotionProposal/api/promotion/getAllProductsByCompanyCode?CustomerCode=${selectedCompany}`);
          setProducts(response.data.data);
          setRowData(response.data.data);
        } catch (err) {
          console.error('Error fetching products:', err);
        }
      };
      fetchProducts();
    }
  }, [selectedCompany]);

  const selectcompanyOptions = useMemo(() => 
    companies.map((company) => (
      <option key={company.CustomerCode} value={company.CustomerCode}>
        {company.companyName}
      </option>
    )),
    [companies]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleCompanySearchChange = (e) => {
    setCompanySearchTerm(e.target.value);
    setShowCompanyDropdown(true);
  };

  const handleSelectProduct = (product) => {
    const selectedProduct = productOptions.find(p => p.value === product.value);
    setProduct(prevProduct => ({
      ...prevProduct,
      productCode: selectedProduct.value,
      productNameEng: selectedProduct.label.split(' (')[0],
      productNameThai: selectedProduct.productNameThai,
      packsize: selectedProduct.packsize,
      price: selectedProduct.price
    }));
    setSearchTerm(selectedProduct.label);
    setShowDropdown(false);
  };

  const handleSelectCompany = (company) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      CustomerCode: company.CustomerCode,
    }));
    setCompanySearchTerm(company.label);
    setShowCompanyDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleAddCustomerClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchTerm || !companySearchTerm) {
      Swal.fire('ข้อผิดพลาด', 'กรุณาค้นหาและเลือกสินค้าและบริษัทก่อนทำการเพิ่ม', 'warning');
      return;
    }

    setIsLoading(true);
    const result = await Swal.fire({
      title: 'ยืนยันการเพิ่มสินค้า?',
      text: 'คุณต้องการเพิ่มสินค้านี้ใช่หรือไม่',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'ใช่, เพิ่มสินค้า',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post('/PromotionProposal/api/promotion/addProduct', {
          ...product,
          role: authUser.role_code,
          role_code: authUser.role_code,
          actionBy: authUser.nameEng
        });

        if (response.data.status === "success") {
          Swal.fire("สำเร็จ", "เพิ่มสินค้าเรียบร้อยแล้ว!", "success");
        } else {
          Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถเพิ่มสินค้าได้", "error");
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า:", error);
        Swal.fire("เกิดข้อผิดพลาด", error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มสินค้า", "error");
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };


  const handleSubmitAddCustomer = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  const result = await Swal.fire({
    title: 'ยืนยันการเพิ่มลูกค้า?',
    text: 'คุณต้องการเพิ่มลูกค้านี้ใช่หรือไม่',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'ใช่, เพิ่มลูกค้า',
    cancelButtonText: 'ยกเลิก'
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.post('/PromotionProposal/api/promotion/addcustomer', {
        ...customerData,
        actionBy: authUser.nameEng,
      });

      if (response.status === 201) { // ตรวจสอบสถานะ HTTP 201
        Swal.fire("สำเร็จ", "เพิ่มลูกค้าเรียบร้อยแล้ว!", "success");
        handleModalClose(); // ปิด modal เมื่อบันทึกสำเร็จ
      } else {
        Swal.fire("เกิดข้อผิดพลาด", response.data.message || "ไม่สามารถเพิ่มลูกค้าได้", "error");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มลูกค้า:", error);
      Swal.fire("เกิดข้อผิดพลาด", error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มลูกค้า", "error");
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};

  




  const filteredProducts = productOptions.filter(product =>
    product.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompanies = companyOptions.filter(company =>
    company.label.toLowerCase().includes(companySearchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setShowCompanyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 w-full mt-14 pt-6 pb-6 flex-col">
      {isAuthorized ? (
        <>
          {isLoading && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
              <div className="text-white text-2xl font-bold">Loading...</div>
            </div>
          )}
          <div className="w-full max-w-7xl bg-white p-16 rounded-lg shadow-md">
            <h2 className="text-3xl font-extrabold text-blue-500 mb-6 text-center">เพิ่มสินค้า</h2>
            <div className='w-full flex justify-end p-2'>
              <button
                type="button"
                onClick={handleAddCustomerClick}
                className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm p-4"
              >
                เพิ่มลูกค้า
              </button>
            </div>

            {/* Modal */}
            {showModal && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div
      className="fixed inset-0 bg-black opacity-50"
      onClick={handleModalClose}
    ></div>
    <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/2 p-8 h-80 relative z-10 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">ลงทะเบียน Customer ใหม่</h2>
      <form onSubmit={handleSubmitAddCustomer}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Channel</label>
          <select
            name="channel"
            value={customerData.channel}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">เลือก Channel</option>
            <option value="MT">MT</option>
            <option value="TT">TT</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">CustomerName</label>
          <input
            type="text"
            name="companyName"
            value={customerData.companyName}
            onChange={handleInputChange}
            placeholder="ชื่อลูกค้า"
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleModalClose}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  </div>
)}


            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              {/* Input fields for product details */}
              <div className="col-span-1 relative" ref={dropdownRef}>
                <label className="block text-gray-700 font-medium mb-1 text-sm">ค้นหาสินค้า <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="ค้นหาด้วยรหัสหรือชื่อสินค้า"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onClick={() => setShowDropdown(true)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                {showDropdown && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map(product => (
                        <li
                          key={product.value}
                          onClick={() => handleSelectProduct(product)}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {product.label}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">ไม่พบสินค้า</li>
                    )}
                  </ul>
                )}
              </div>
              {/* More input fields */}
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-1 text-sm">รหัสสินค้า</label>
                <input
                  type="text"
                  name="productCode"
                  value={product.productCode}
                  onChange={handleChange}
                  maxLength="50"
                  
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-1 text-sm">ชื่อสินค้า (อังกฤษ)</label>
                <input
                  type="text"
                  name="productNameEng"
                  value={product.productNameEng}
                  onChange={handleChange}
                  maxLength="255"
                  
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-1 text-sm">ชื่อสินค้า (ไทย)</label>
                <input
                  type="text"
                  name="productNameThai"
                  value={product.productNameThai}
                  onChange={handleChange}
                  maxLength="255"
                  
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-1 text-sm">ขนาดบรรจุ</label>
                <input
                  type="text"
                  name="packsize"
                  value={product.packsize}
                  onChange={handleChange}
                  maxLength="50"
                  
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-1 text-sm">ราคา</label>
                <input
                  type="text"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="col-span-1 relative" ref={companyDropdownRef}>
                <label className="block text-gray-700 font-medium mb-1 text-sm">ชื่อบริษัท <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="ค้นหาชื่อบริษัท"
                  value={companySearchTerm}
                  onChange={handleCompanySearchChange}
                  onClick={() => setShowCompanyDropdown(true)}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                {showCompanyDropdown && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {filteredCompanies.length > 0 ? (
                      filteredCompanies.map(company => (
                        <li
                          key={company.value}
                          onClick={() => handleSelectCompany(company)}
                          className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                        >
                          {company.label}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500">ไม่พบบริษัท</li>
                    )}
                  </ul>
                )}
              </div>
              <div className="col-span-1">
                <label className="block text-gray-700 font-medium mb-1 text-sm">รหัสลูกค้า</label>
                <input
                  type="text"
                  name="CustomerCode"
                  value={product.CustomerCode}
                  onChange={handleChange}
                  maxLength="50"
                  disabled
                  className="w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                type="submit"
                className="col-span-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                เพิ่มสินค้า
              </button>
            </form>

            {/* ส่วนที่แสดงตาราง */}
            <h1 className='text-xl font-semibold text-blue-500 mt-4'>เลือกเพื่อดูสินค้า / ลบสินค้า</h1>
            <div className='flex gap-6 mt-2'>
              <div>
                <label className="block text-gray-700 font-medium">Channel</label>
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
                <label className="block text-gray-700 font-medium">Customer</label>
                <select
                  className='w-40 border h-8 rounded-md'
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  disabled={!channel}
                >
                  <option value="">เลือก Customer</option>
                  {selectcompanyOptions}
                </select>
              </div>
            </div>

            {rowData.length > 0 && (
              <div className="ag-theme-alpine mt-4" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={{
                    sortable: true,
                    filter: true,
                  }}
                />
              </div>
            )}

            <div className="ag-theme-alpine custom-header-color2 mt-4" style={{ height: 400, width: '100%' }}>
              <h2 className="text-2xl font-semibold text-blue-500">ประวัติการเปลี่ยนแปลงสินค้า</h2>
              <AgGridReact
                rowData={modifyProductRowData}
                columnDefs={productDefs}
                defaultColDef={{ sortable: true, filter: true }}
              />
            </div>
          </div>
        </>
      ) : (
        <h2 className="text-6xl font-extrabold text-red-600">คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้</h2>
      )}
    </div>
  );
}

