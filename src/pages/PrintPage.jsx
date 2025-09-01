import React, { useState } from 'react';

export default function PrintPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    MAIL: false,
    IN_STORE: false,
    OTHER: false,
    SUPPORT_DEDUCTION: false,
    TRADE_AGREEMENT: false,
    OTHER_CLAIM: false,
  });
  const [noteText, setNoteText] = useState('');

  const handleCheckboxChange = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      [e.target.value]: e.target.checked,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleNoteChange = (e) => {
    setNoteText(e.target.value);
  };

  const [rowData] = useState([
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
    {
      no: 1,
      code: 'Sundee choo',
      barcode: '123456789',
      productName: 'Sundae choo',
      unitPrice: 20.00,
      regularPrice: 25.00,
      promoPrice: 18.00,
      discount: '7%',
      gpPromo: '1%',
      promoPeriod: '03/09/2024',
      salesTarget: '7.00',
    },
  ]);

  return (
    <div className="print-container p-8">
      {/* ส่วนหัว */}
      <div className="flex flex-col justify-between">
        <div className="w-[400px]">
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Logo"
              className="w-auto h-[70px] cursor-pointer"
              onClick={() => document.getElementById('imageUpload').click()}
            />
          ) : (
            <input
              id="imageUpload"
              type="file"
              onChange={handleImageChange}
              style={{ display: selectedImage ? 'none' : 'block' }}
            />
          )}
          <input
            id="imageUpload"
            type="file"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>
        <div className="w-full text-center justify-center items-center">
          <h1 className="font-bold text-2xl">ใบยืนยันราคาสินค้าและการจัดรายการส่งเสริมการขาย</h1>
        </div>
      </div>

      {/* ข้อมูลผู้ติดต่อ */}
      <div className="flex justify-between mt-4">
        <div className="w-[600px] flex justify-evenly gap-4">
          <div className="w-full">
            <div className="text-base">
              <span className="font-bold">วันที่จัดทำ:</span> 03/09/2024
            </div>
            <div className="text-base">
              <span className="font-bold">ชื่อผู้ติดต่อ:</span> คุณวรากร เยาว์ไทใจ
            </div>
            <div className="text-base">
              <span className="font-bold">ประเภทสินค้า:</span> ICE CREAM
            </div>
            <div className="text-base">
              <span className="font-bold">หมายเหตุ:</span> สำหรับโปรโมชั่นนี้...
            </div>

            <div className="text-base w-full flex">
              <span className="font-bold">รูปแบบรายการ:</span>
              <label className="px-2">
                <input
                  type="checkbox"
                  value="MAIL"
                  checked={selectedOptions.MAIL}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                MAIL
              </label>
              <label className="px-2">
                <input
                  type="checkbox"
                  value="IN_STORE"
                  checked={selectedOptions.IN_STORE}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                IN-STORE
              </label>
              <div className="flex flex-col">
                <label className="px-2">
                  <input
                    type="checkbox"
                    value="OTHER"
                    checked={selectedOptions.OTHER}
                    onChange={handleCheckboxChange}
                    className="mr-2"
                  />
                  อื่นๆ (ระบุ)
                </label>
                <input className="border w-18 h-6 rounded-md p-2" />
              </div>
            </div>
            <div className="text-base">
              <span className="font-bold">ระยะเวลาของรายการ :</span>______________
            </div>
          </div>

          {/* ส่วนที่ 2 */}
          <div className="w-1/2">
            <div>
              <div className="text-base">
                <span className="font-bold">ชื่อผู้เสนอรายการ :</span> xxxxx
              </div>
              <div className="text-base">
                <span className="font-bold">ชื่อบริษัทผู้ผลิต/ผู้ขาย :</span> xxxx
              </div>
              <div className="text-base">
                <span className="font-bold">รหัสผู้ผลิต/ผู้ขาย :</span> xxxx
              </div>
            </div>
          </div>
        </div>
        <div className="text-right w-1/4">
          <div className="text-base">
            <span className="font-bold">Category Code:</span> ________________
          </div>
          <div className="text-base">
            <span className="font-bold">Division Code:</span> ________________
          </div>
        </div>
      </div>

      <div className="w-full ">
        <div className="text-base w-full flex">
          <span className="font-bold mr-4">ค่าสื่อสนับสนุน :</span>
          <div className="flex flex-col">
            <div className="flex">
              <div className="flex gap-4 mr-2">
                <p>จำนวนเงิน</p>
                <p>-</p>
              </div>
              <label className="px-2">
                <input
                  type="checkbox"
                  value="SUPPORT_DEDUCTION"
                  checked={selectedOptions.SUPPORT_DEDUCTION}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                หักหน้าบัญชี ในรอบการชำระค่าบริการของบริษัท
              </label>
              <label className="px-2">
                <input
                  type="checkbox"
                  value="TRADE_AGREEMENT"
                  checked={selectedOptions.TRADE_AGREEMENT}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                เรียกเก็บตามค่าใช้จ่ายที่ระบุใน Trade agreement ประจำปี
              </label>
              <label className="px-2">
                <input
                  type="checkbox"
                  value="OTHER_CLAIM"
                  checked={selectedOptions.OTHER_CLAIM}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                อื่นๆ ใบเคลม เลขที่.............
              </label>
              <input className="border w-20 h-8 rounded-md p-2" />
            </div>
          </div>
        </div>
      </div>

      {/* ตาราง HTML */}
      <div className="mt-4">
        <table className="table-auto w-full border-collapse text-[8px]">
          <thead>
            <tr className="bg-yellow-300">
              <th rowSpan="2" className="border px-1 py-1 text-center">NO.</th>
              <th rowSpan="2" className="border px-1 py-1 text-center">CODE</th>
              <th rowSpan="2" className="border px-1 py-1 text-center">BAR CODE</th>
              <th rowSpan="2" className="border px-1 py-1 text-center">ชื่อสินค้า</th>
              <th rowSpan="2" className="border px-1 py-1 text-center bg-yellow-500">ราคาบรรจุต่อหีบ</th>
              <th colSpan="2" className="border px-1 py-1 text-center bg-red-500">ราคาขายต่อหน่วย</th>
              <th colSpan="2" className="border px-1 py-1 text-center bg-yellow-500">ราคาขายโปรโมชั่น</th>
              <th colSpan="4" className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติหีบและชิ้น(ไม่รวมVAT)</th>
              <th rowSpan="2" className="border px-1 py-1 text-center bg-yellow-500">GP% ปกติ</th>
              <th colSpan="4" className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนโปรโมชั่นหีบและชิ้น(ไม่รวม VAT)</th>
              <th rowSpan="2" className="border px-1 py-1 text-center bg-yellow-500">GP% โปรโมชั่น</th>
              <th colSpan="2" className="border px-1 py-1 text-center bg-red-500">ระยะเวลาต้นทุนโปรโมชั่น</th>
              <th rowSpan="2" className="border px-1 py-1 text-center bg-red-500">จ่ายชดเชยจากยอดขาย(บาทต่อชิ้น)</th>
              <th rowSpan="2" className="border px-1 py-1 text-center bg-red-500">เป้าหมายการขาย(หน่วย)</th>
            </tr>
            <tr className="bg-yellow-300">
              <th className="border px-1 py-1 text-center bg-red-500">รวม VAT</th>
              <th className="border px-1 py-1 text-center bg-red-500">ไม่รวม VAT</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">รวม VAT</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ไม่รวม VAT</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติต่อหีบ N-Vat</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ส่วนลดปกติ(บาทหรือ %)</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติต่อหีบหลังหักส่วนลด N-Vat</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติต่อชิ้นหลังหักส่วนลด N-Vat</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติต่อหีบ N-Vat</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ส่วนลดปกติ(บาทหรือ %)</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติต่อหีบหลังหักส่วนลด N-Vat</th>
              <th className="border px-1 py-1 text-center bg-yellow-500">ต้นทุนปกติต่อชิ้นหลังหักส่วนลด N-Vat</th>
              <th className="border px-1 py-1 text-center">เริ่มวันที่</th>
              <th className="border px-1 py-1 text-center">สิ้นสุดวันที่</th>
            </tr>
          </thead>
          <tbody>
            {rowData.map((row, index) => (
              <tr key={index}>
                <td className="border px-1 py-1 text-center">{row.no}</td>
                <td className="border px-1 py-1 text-center">{row.code}</td>
                <td className="border px-1 py-1 text-center">{row.barcode}</td>
                <td className="border px-1 py-1 text-center">{row.productName}</td>
                <td className="border px-1 py-1 text-center">{row.unitPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">{row.regularPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">
                  {(row.regularPrice - row.regularPrice * 0.07).toFixed(2)}
                </td>
                <td className="border px-1 py-1 text-center">{row.promoPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">
                  {(row.promoPrice - row.promoPrice * 0.07).toFixed(2)}
                </td>
                <td className="border px-1 py-1 text-center">---</td>
                <td className="border px-1 py-1 text-center">---</td>
                <td className="border px-1 py-1 text-center">---</td>
                <td className="border px-1 py-1 text-center">---</td>
                <td className="border px-1 py-1 text-center">{row.gpPromo}</td>
                <td className="border px-1 py-1 text-center">{row.unitPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">{row.unitPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">{row.unitPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">{row.unitPrice.toFixed(2)}</td>
                <td className="border px-1 py-1 text-center">{row.gpPromo}</td>
                <td className="border px-1 py-1 text-center">วันเริ่ม</td>
                <td className="border px-1 py-1 text-center">วันสินสุด</td>
                <td className="border px-1 py-1 text-center">xxxx</td>
                <td className="border px-1 py-1 text-center">xxxx</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full flex justify-center p-2">
        <h1 className="w-24 mt-2">หมายเหตุ :</h1>
        <textarea
          className="w-[1200px] h-[100px] border rounded-md  p-2 ml-4"
          value={noteText}
          onChange={handleNoteChange}
        />
      </div>

 
      {/* หมายเหตุ */}
      <div className="mt-1">
        <div className="text-base">
          <p>**หากมูลค่ากิจกรรมเกินจำนวนเงินที่เรียกเก็บ บริษัทคู่ค้ายินดีที่จะสนับสนุนค่าใช้จ่ายส่วนเพิ่มที่เกิดขึ้นจากกิจกรรม**</p>
          <p>**ทางบริษัทจะเรียกเก็บค่าปรับ 10% ต่อความเสียหายที่เกิดขึ้น กรณีที่สินค้าโปรโมชั่นนี้ถูกยกเลิกเนื่องจาก Supplier หรือกรณีขาดส่งสินค้า โดยคำนวณค่าปรับจากมูลค่าการเสียโอกาสทางการขาย**</p>
          <p>**สำหรับสาขาใหม่ที่เปิดในวันที่23และวันที่ 24 ของเดือน จะใช้โปรโมชั่นของรอบ 25-24**</p>
        </div>
      </div>

      {/* ลงนาม */}
      <div className="flex justify-between mt-2">
        <div className="text-base flex flex-col gap-3">
          <p>ลายเซ็นผู้ผลิต / ผู้ขาย: ___________________________________________</p>
          <div className='flex gap-60'>
          <span>{`(`}</span>
          <span>{`)`}</span>
          </div>
          <p>วันที่: ____________________________________________</p>
        </div>
        <div className="text-base flex flex-col gap-3">
          <p>ลายเซ็นบริษัท xxxxx</p>
          <div className="text-base flex flex-col gap-3">
          <p>จัดซื้อผู้รับผิดชอบ: ___________________________________________</p>
        </div>
        </div>
        <div className="text-base flex flex-col gap-3">
          <div className="text-base flex flex-col gap-3">
          <p>Admin ตรวจทาน: ___________________________________________</p>
        </div>
          <div className="text-base flex flex-col gap-3">
          <p>ผู้จัดการฝ่ายจัดซื้อ: ___________________________________________</p>
        </div>
        </div>
      </div>

      {/* กำหนด CSS ภายใน JSX */}
      <style>{`
        @media print {
    
        textarea {
    border: none !important;
  }
          .print-show {
            display: block;
          }

          .print-container {
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 10mm;
            box-sizing: border-box;
            font-size: 10px;
          }

          body {
            margin: 0;
            padding: 0;
          }

          .persistent-drawer {
            display: none;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            page-break-inside: avoid;
          }

          th,
          td {
            border: 1px solid black;
            padding: 2px;
          }

          .bg-yellow-300 {
            background-color: #ffff99 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .bg-yellow-500 {
            background-color: #FFD700 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          .bg-red-500 {
            background-color: #FF6347 !important;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }

          /* เปลี่ยนเป็นแนวนอน */
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }

        .text-base {
          font-size: 10px;
        }

        .text-xl {
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}
