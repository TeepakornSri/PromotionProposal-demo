import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  MenuItem, 
  Select, 
  InputLabel, 
  FormControl, 
  Autocomplete,
  Grid,
  Typography,
  FormHelperText
} from '@mui/material';
import Showallusers from '../components/Showallusers';
import { useAuth } from '../hooks/use-auth';

export default function Adduser() {
  const { authUser } = useAuth();
  const [formData, setFormData] = useState({
    usercode: '',
    name: '',
    surname: '',
    name_th: '',
    surname_th: '',
    Contact_Email: '',
    role_code: 'user',
    prefix: 'Mr.',
    department: '',
    position: '',
    password: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState({
    hasLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    isEnglishOnly: true
  });
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [departmentRes, positionRes] = await Promise.all([
          axios.get('/PromotionProposal/api/auth/fnul_department'),
          axios.get('/PromotionProposal/api/auth/fnul_position'),
        ]);
        setDepartments(departmentRes.data.data);
        setPositions(positionRes.data.data);
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch departments or positions!',
        });
      }
    };
    fetchData();
  }, []);

  // Check if passwords match and validate password complexity whenever password field changes
  useEffect(() => {
    // Validate password match
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }

    // Validate password complexity
    const password = formData.password;
    
    // Check for minimum length of 8 characters
    const hasLength = password.length >= 8;
    
    // Check for at least one lowercase English letter
    const hasLowercase = /[a-z]/.test(password);
    
    // Check for at least one uppercase English letter
    const hasUppercase = /[A-Z]/.test(password);
    
    // Check for at least one number
    const hasNumber = /[0-9]/.test(password);
    
    // Check for at least one special character from !#%&
    const hasSpecialChar = /[!#%&]/.test(password);
    
    // Check if password contains only English characters, numbers, and allowed special characters
    // const isEnglishOnly = /^[a-zA-Z0-9!#%&]*$/.test(password);
    const isEnglishOnly = /^[a-zA-Z0-9\p{P}\p{S}]*$/u.test(password);

    setPasswordValidation({
      hasLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      isEnglishOnly
    });

  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  

  // Helper function to determine if the password field should show an error
  const hasPasswordError = () => {
    if (!formData.password) return false;
    
    return !(
      passwordValidation.hasLength &&
      passwordValidation.hasLowercase &&
      passwordValidation.hasUppercase &&
      passwordValidation.hasNumber &&
      passwordValidation.hasSpecialChar &&
      passwordValidation.isEnglishOnly
    );
  };

  // Helper function to generate password requirements helper text
  const getPasswordHelperText = () => {
    if (!formData.password) return "Password must have at least 8 characters, include lowercase and uppercase letters, a number, and one of !#%&";
    
    const errors = [];
    
    if (!passwordValidation.hasLength) errors.push("at least 8 characters");
    if (!passwordValidation.hasLowercase) errors.push("one lowercase letter");
    if (!passwordValidation.hasUppercase) errors.push("one uppercase letter");
    if (!passwordValidation.hasNumber) errors.push("one number");
    if (!passwordValidation.hasSpecialChar) errors.push("one special character (!#%&)");
    if (!passwordValidation.isEnglishOnly) errors.push("only English characters");
    
    if (errors.length === 0) return "Password meets all requirements";
    return `Password must include ${errors.join(", ")}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords match and complexity before submission
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!',
      });
      return;
    }

    // Check all password validation criteria
    const {
      hasLength,
      hasLowercase,
      hasUppercase,
      hasNumber,
      hasSpecialChar,
      isEnglishOnly
    } = passwordValidation;

    if (!hasLength || !hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar || !isEnglishOnly) {
      Swal.fire({
        icon: 'error',
        title: 'Password Error',
        text: 'Password does not meet all requirements!',
      });
      return;
    }

    const nameEng = `${formData.name} ${formData.surname}`.trim();
    const nameThai = `${formData.name_th} ${formData.surname_th}`.trim();
    const prefix_th =
      formData.prefix === 'Mr.'
        ? 'นาย'
        : formData.prefix === 'Mrs.'
        ? 'นาง'
        : 'น.ส.';

    const payload = {
      ...formData,
      nameEng,
      nameThai,
      prefix_th,
    };

    // ข้อมูล department จับคู่กับ ID
    const departmentMapping = {
      'CHANNEL DEVELOPMENT': 1,
      'DOMESTIC SALES': 2,
      'FINANCE & ACCOUNTING': 3,
      'FINANCE & ACCOUNTING DEPOT': 4,
      'GENERAL SALES ADMIN': 5,
      'HUMAN CAPITAL': 6,
      'INDOCHINA SALES & MARKETING': 7,
      'INTERNAL AUDIT': 8,
      'INTERNATIONAL BUSINESS DEVELOPMENT': 9,
      'INTERNATIONAL LOGISTICS': 10,
      'LEGAL': 11,
      'LOGISTICS': 12,
      'MANAGEMENT INFORMATIONS SYSTEM': 13,
      'MANUFACTURING': 14,
      'MARKETING': 15,
      'MODERN TRADE': 16,
      'PLANNING': 17,
      'PRODUCTION': 18,
      'PURCHASING': 19,
      'QUALITY ASSURANCE': 20,
      'REGULATORY AFFAIR': 21,
      'REPAIRS & MAINTENANCE': 22,
      'RESEARCH & DEVELOPMENT': 23,
      'SAFETY & HEALTH ENVIRONMENT': 24,
      'SALES ASSET': 25,
      'SALES THAILAND & INDOCHINA': 26,
      'SUPPLY CHAIN': 27,
      'UTILITY & ENERGY': 28,
      'WAREHOUSE': 29,
      'GENERAL MANAGER': 30,
      'EXTERNAL F&N': 31
    };

    // ข้อมูล position จับคู่กับ ID
    const positionMapping = {
      'SUPERADM': 1,
      'A/P ACCOUNTANT': 2,
      'A/R & ADMINISTRATIVE ACCOUNTANT': 3,
      'A/R STAFF': 4,
      'A/R STAFF - DIRECT SALES': 5,
      'A/R SUPERVISOR DEPOT': 6,
      'ACCOUNTING SUPERVISOR': 7,
      'AREA MANAGER': 8,
      'AREA SALES MANAGER': 9,
      'ASSISTANT FINANCE & ACCOUNTING MANAGER': 10,
      'ASSISTANT PRODUCTION MANAGER': 11,
      'ASST. ACCOUNTING MANAGER': 13,
      'ASST. COMMERCIAL FINANCE MANAGER': 14,
      'ASST. CREDIT MANAGER': 15,
      'ASST. FOREMAN LOADING': 16,
      'ASST. IBD MANAGER': 17,
      'ASST. LEGAL MANAGER': 18,
      'ASST. MAINTENANCE MANAGER': 19,
      'ASST. MODERN TRADE MANAGER': 20,
      'ASST. OPERATOR': 21,
      'ASST. PLANNING & LOGISTICS MANAGER': 22,
      'ASST. QA MANAGER': 23,
      'ASST. QA SUPERVISOR': 24,
      'ASST. SALES ASSET MANAGER': 25,
      'ASST. SALES DEVELOPMENT MANAGER': 26,
      'ASST. SUB-DISTRIBUTOR PARTNER MANAGER': 27,
      'ASST. SUPPLY CHAIN MANAGER': 28,
      'ASST. SUPPLY CHAIN PLANNING MANAGER': 29,
      'ASST. TRADE MARKETING MANAGER': 30,
      'ASST.LOGISTICS SUPERVISOR': 31,
      'ASST.MANAGER - REGULATORY AND ADMIN': 32,
      'BILL COLLECTOR': 33,
      'BRANCH MANAGER': 34,
      'BRAND & DIGITAL SUPPORT MANAGER': 35,
      'BRAND MANAGER': 36,
      'C&B OFFICER': 37,
      'CHANNEL DEVELOPMENT EXECUTIVE': 38,
      'CHECKER': 39,
      'CONTROL (PRODUCTION)': 41,
      'CREDIT CONTROL MANAGER': 42,
      'DEMAND PLANNING OFFICER': 43,
      'ENGINEERING ADMIN STAFF': 44,
      'ENGINEERING SUPERVISOR': 45,
      'ENVIRONMENT OPERATOR': 46,
      'ENVIRONMENT STAFF (SAFETY OFFICER)': 47,
      'EXTERNAL F&N': 199,
      'F&A STAFF': 48,
      'FILLING STAFF': 49,
      'FINANCE & ACCOUNTING MANAGER': 50,
      'FOREMAN': 51,
      'FORKLIFT DRIVER': 53,
      'GARDENER': 55,
      'GENERAL MANAGER': 56,
      'GENERAL WORKER': 57,
      'GL ACCOUNTANT OFFICER': 58,
      'HC OFFICER': 59,
      'HC OFFICER - RECRUITMENT': 60,
      'HC PLANT MANAGER': 62,
      'HC SUPERVISOR': 63,
      'HCBP MANAGER': 64,
      'HCD SUPERVISOR': 65,
      'HEAD OF FINANCE': 66,
      'HEAD OF HC DEPARTMENT': 67,
      'HEAD OF IBD DEPARTMENT': 68,
      'HEAD OF MANUFACTURING': 69,
      'HEAD OF MARKETING THAILAND': 70,
      'HEAD OF REGIONAL MARKETING': 71,
      'HEAD OF SALES THAILAND & INDOCHINA': 72,
      'HEAD OF SUPPLY CHAIN DEPARTMENT': 73,
      'HUMAN CAPITAL MANAGER': 74,
      'IBD MANAGER': 75,
      'IBD OFFICER': 76,
      'IBD SUPERVISOR': 77,
      'IMPORT PURCHASING EXECUTIVE': 78,
      'INDOCHINA SALES & MARKETING MANAGER': 79,
      'INDOCHINA SALES COORDINATOR EXECUTIVE': 80,
      'INTERNAL AUDIT MANAGER': 81,
      'INTERNATIONAL LOGISTICS OFFICER': 82,
      'INTERNATIONAL LOGISTICS SUPERVISOR': 83,
      'IT MANAGER': 84,
      'IT OFFICER': 85,
      'IT PROGRAMMER': 86,
      'IT SUPPORT': 87,
      'KEY ACCOUNTS EXECUTIVE': 88,
      'LINE LEADER': 89,
      'LOADING STAFF': 90,
      'LOGISTIC ADMIN SUPERVISOR': 92,
      'LOGISTICS ADMIN OFFICER': 94,
      'LOGISTICS ADMIN STAFF': 96,
      'LOGISTICS MANAGER': 98,
      'LOGISTICS OPERATION SUPERVISOR': 99,
      'LOGISTICS STAFF': 100,
      'MAINTENANCE MANAGER': 101,
      'MAINTENANCE TECHNICIAN': 102,
      'MAKETING OFFICER': 103,
      'MARKET INFORMATION MANAGER': 104,
      'MARKETING EXECUTIVE': 105,
      'MATERIAL PLANNING OFFICER': 106,
      'MESSENGER': 107,
      'MFG. STAFF': 108,
      'MIXING & COOKER STAFF': 109,
      'MODERN TRADE MANAGER': 110,
      'OPERATER FILLING': 111,
      'OPERATOR': 112,
      'OPERATOR FILLING': 113,
      'OPERATOR ROBOT': 114,
      'OPERATOR SCADA': 115,
      'PACKING GIRL': 116,
      'PACKING STAFF': 117,
      'PRODUCTION MANAGER': 118,
      'PRODUCTION PLANNING MANAGER': 119,
      'PRODUCTION PLANNING SUPERVISOR': 120,
      'PRODUCTION SUPERVISOR': 121,
      'PURCHASING MANAGER': 122,
      'PURCHASING OFFICER': 123,
      'QA INSPECTOR': 124,
      'QA MANAGER': 125,
      'QA SUPERVISOR': 126,
      'QC (LAB STAFF)': 127,
      'QC FORELADY': 128,
      'QC FOREMAN': 129,
      'QC INSPECTOR': 130,
      'QC SUPERVISOR': 131,
      'R&D OFFICER': 132,
      'R&D PACKAGING SPECIALIST': 133,
      'R&D STAFF': 134,
      'R&D SUPERVISOR': 135,
      'REGIONAL R&D MANAGER & ICE CREAM DIVISION': 136,
      'REGIONAL SALES MANAGER': 137,
      'ROBOT STAFF': 138,
      'SAFETY OFFICER': 139,
      'SALES ADMIN OFFICER': 140,
      'SALES ASSET & OPERATION MANAGER': 141,
      'SALES ASSET OFFICER': 142,
      'SALES ASSET SUPPORT': 143,
      'SALES OPERATION ASSISTANT MANAGER': 144,
      'SALES OPERATION EXECUTIVE': 145,
      'SALES OPERATION MANAGER': 146,
      'SALES OPERATION SPECIALIST': 147,
      'SALES REPRESENTATIVE': 148,
      'SALES SUPERVISOR': 149,
      'SAP OFFICER': 150,
      'SAP STAFF': 151,
      'SCIENTIFIC REGULATORY AFFAIR MANAGER': 152,
      'SENIOR A/R ACCOUNTANT': 153,
      'SENIOR A/R ACCOUNTANT DIRECT SALES': 154,
      'SENIOR A/R STAFF': 155,
      'SENIOR ADMIN SUPERVISOR': 156,
      'SENIOR CASHIER': 157,
      'SENIOR CHANNEL DEVELOPMENT MANAGER': 158,
      'SENIOR COST ACCOUNTANT': 159,
      'SENIOR ENVIRONMENTAL SUPERVISOR': 160,
      'SENIOR F&A STAFF': 161,
      'SENIOR FINANCE': 162,
      'SENIOR FINANCE & ACCOUNTING STAFF': 163,
      'SENIOR HCD OFFICER TRAINING & DEVELOPMENT': 164,
      'SENIOR MAINTENANCE SUPERVISOR': 165,
      'SENIOR MAINTENANCE TECHNICIAN': 166,
      'SENIOR MARKETING EXECUTIVE': 167,
      'SENIOR OPERATOR': 168,
      'SENIOR PRODUCTION SUPERVISOR': 169,
      'SENIOR PROGRAMMER': 198,
      'SENIOR PURCHASING OFFICER': 170,
      'SENIOR QA SUPERVISOR': 171,
      'SENIOR QC SUPERVISOR': 172,
      'SENIOR R&D MANAGER': 173,
      'SENIOR R&D SUPERVISOR': 174,
      'SENIOR SALES ADMIN OFFICER': 175,
      'SENIOR SALES ASSET OFFICER': 176,
      'SENIOR TECHNICIAN': 177,
      'SENIOR WAREHOUSE OFFICER': 178,
      'SENIOR WAREHOUSE STAFF': 179,
      'SENIOR WAREHOUSE SUPERVISOR': 180,
      'SHE MANAGER': 181,
      'STOCK (PRODUCTION)': 182,
      'STOREKEEPER': 183,
      'STOREKEEPER - SHOP ONLINE': 184,
      'TECHNICIAN': 186,
      'TECHNICIAN SUPERVISOR': 187,
      'TELE-SALES': 188,
      'TRADE MARKETING EXECUTIVE': 189,
      'UTILITY & ENERGY MANAGER': 190,
      'WAREHOUSE ADMIN STAFF': 191,
      'WAREHOUSE FOREMAN': 192,
      'WAREHOUSE OFFICER': 193,
      'WAREHOUSE STAFF': 194,
      'พนักงานควบคุมระบบบำบัดน้ำเสีย': 195,
      'พนักงานจัดการของเสีย': 196,
      'แม่บ้าน': 197,
    };

    // หา department_id และ position_id จากข้อมูลที่ผู้ใช้เลือก
    const department_id = departmentMapping[formData.department] || '';
    const position_id = positionMapping[formData.position] || '';

    // สร้าง payload สำหรับ API ภายนอก
    const externalPayload = {
      userId: formData.usercode,
      email: formData.Contact_Email,
      password: formData.password,
      passwordRepeat: formData.confirmPassword,
      prefixId: formData.prefix === 'Mr.' ? '1' : formData.prefix === 'Mrs.' ? '2' : '3',
      prefix: formData.prefix,
      fnameE: formData.name,
      lnameE: formData.surname,
      prefix_th,
      fnameT: formData.name_th,
      lnameT: formData.surname_th,
      departmentId: department_id.toString(), // แปลงเป็น string เพื่อความปลอดภัย
      department: formData.department,
      positionId: position_id.toString(), // แปลงเป็น string เพื่อความปลอดภัย
      position: formData.position,
      locationId: '1', // ตามที่กำหนดให้เป็น 1 เสมอ
      location: 'OFFICE', // ตามที่กำหนดให้เป็น OFFICE เสมอ
      status: 'F',
      userSession: authUser.usercode,
      appId: 8
    };

    // แสดงข้อมูลที่จะส่งไปยัง API ภายนอก
    console.log('External API payload:', externalPayload);

    try {
      const response = await axios.post('/PromotionProposal/api/auth/adduser', payload);
      
      // ส่งข้อมูลไปยัง API ภายนอก
      try {
        await axios.post('https://fnulogincontrolint.fngroup.com.sg/saveAddUser', externalPayload);
      } catch (externalError) {
        console.error('Error sending data to external API:', externalError);
      }
      
      Swal.fire({
        icon: 'success',
        title: 'User Created',
        text: response.data.message,
      });
      setFormData({
        usercode: '',
        name: '',
        surname: '',
        name_th: '',
        surname_th: '',
        Contact_Email: '',
        role_code: 'user',
        prefix: 'Mr.',
        department: '',
        position: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Something went wrong!',
      });
    }
  };

  return (
    <div className='w-full h-screen flex flex-col pt-16 gap-12'>
      <div className='justify-center items-center flex w-full'>
        <Card sx={{ width: '90%', padding: 2, boxShadow: 3 ,height:'95%'}}>
          <CardHeader
            title={
              <Typography variant="h4" align="center" sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Add New User
              </Typography>
            }
          />
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="User Code"
                    name="usercode"
                    value={formData.usercode}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Prefix</InputLabel>
                    <Select
                      name="prefix"
                      value={formData.prefix}
                      onChange={handleChange}
                    >
                      <MenuItem value="Mr.">Mr.</MenuItem>
                      <MenuItem value="Mrs.">Mrs.</MenuItem>
                      <MenuItem value="Ms.">Ms.</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name (English)"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name (English)"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="First Name (Thai)"
                    name="name_th"
                    value={formData.name_th}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Last Name (Thai)"
                    name="surname_th"
                    value={formData.surname_th}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={departments.map((dept) => dept.department)}
                    value={formData.department}
                    onChange={(e, value) => handleAutocompleteChange('department', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Department" margin="normal" />
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={positions.map((pos) => pos.position)}
                    value={formData.position}
                    onChange={(e, value) => handleAutocompleteChange('position', value)}
                    renderInput={(params) => (
                      <TextField {...params} label="Position" margin="normal" />
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contact Email"
                    name="Contact_Email"
                    type="email"
                    value={formData.Contact_Email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Role Code</InputLabel>
                    <Select
                      name="role_code"
                      value={formData.role_code} 
                      onChange={handleChange}
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="ADMIN">ADMIN</MenuItem>
                      <MenuItem value="Approved_Step1">Approved_Step1</MenuItem>
                      <MenuItem value="Approved_Step2">Approved_Step2</MenuItem>
                      <MenuItem value="Approved_Step3">Approved_Step3</MenuItem>
                      <MenuItem value="Approved_Step4">Approved_Step4</MenuItem>
                      <MenuItem value="GM">GM</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={hasPasswordError()}
                    helperText={getPasswordHelperText()}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2, padding: 1.5, fontSize: '1rem' }}
                    disabled={!!passwordError || hasPasswordError() || !formData.password}
                  >
                    Create User
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Showallusers />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}