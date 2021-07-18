import React, { useEffect,useState,useRef } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
} from "reactstrap";
import { useReactToPrint } from "react-to-print";

const ComponentToPrint = React.forwardRef((props, ref) => (
    <div className="card card--new" ref={ref}>
        <div className="row p-5">
            <div className="col-12">
                <div className="row">
                    <div className="col-6">
                        <h5 style={{ fontSize: '22px', fontWeight: '500' }}>BỆNH VIỆN Y HỌC CỔ TRUYỀN</h5>
                        <span className='font-weight-bold' style={{ fontSize: '22px'}}>KHOA, PHÒNG:</span>
                    </div>
                    <div className="col-6 text-center">
                        <h5 className='font-weight-bold text-right' style={{ fontSize: '22px' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h5>
                        <span className='font-weight-bold text-center' style={{ fontSize: '20px' }}>
                            Độc lập - Tự do - Hạnh Phúc.
                        </span>
                        <hr style={{ background: '#000', width: '45%' }}></hr>
                    </div>
                </div>
            </div>
            <div className="col-12 text-right font-italic mb-2" style={{ fontSize: '20px', fontWeight: '500' }}>
                Đà Nẵng, ngày {props.dataDate.day} tháng {props.dataDate.month} năm {props.dataDate.year}
            </div>
            <div className="col-12 text-center font-weight-bold" style={{ fontSize: '35px' }}>
                PHIẾU ĐỀ XUẤT NHU CẦU
            </div>
            <div className="col-12 mb-2" style={{ fontSize: '22px' }}>
                Lý do: {props.data.reason}
            </div>
            <div className="col-12" style={{ fontSize: '22px' }}>
                Nội dung đề xuất: {props.data.solution}
            </div>
            <div className="col-12 row m-0 pr-0 mt-3 mb-5 " style={{ fontSize: '22px'}}>
                <div className="col-2 font-weight-bold pl-0 mb-5">GIÁM ĐỐC</div>
                <div className="col-3 font-weight-bold text-center">TP.TC-HC</div>
                <div className="col-4 font-weight-bold text-cente">TRƯỞNG KHOA, PHÒNG</div>
                <div className="col-3 font-weight-bold text-right">
                    NGƯỜI LẬP PHIẾU
                </div>
            </div>
        </div>
    </div>
));

const PrintModal = (props) =>{
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
      });
    const [dataDate,setDataDate] = useState({day:'',month:'',year:''})
    useEffect(() => {
        setDataDate(_getDateNow())
    },[])
    const _getDateNow = () => {
        const dateNow = new Date();
        let month = "" + (dateNow.getMonth() + 1);
        let day = "" + dateNow.getDate();
        let year = dateNow.getFullYear();
        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;
        const a = { day, month, year}
        console.log('date',a);
        return a
    }
        const { isShowModal, toggleModal, data } = props
        console.log('props',props);
        return (
            <div>
                <Modal isOpen={isShowModal} toggle={toggleModal}>
                    <ModalHeader tag="h4" toggle={toggleModal}>
                        PHIẾU ĐỀ XUẤT
                    </ModalHeader>
                    <ModalBody>
                      <button
                        type="button"
                        className="bg-gray-500 border border-gray-500 p-2 mb-4"
                        onClick={handlePrint}
                    >
                        {" "}
                        Print Resume{" "}
                    </button>
                    <ComponentToPrint data={data} dataDate={dataDate} ref={componentRef} />
                    </ModalBody>

                </Modal>
            </div>
        );
    
}

export default PrintModal;