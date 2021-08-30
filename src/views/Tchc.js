import React, { Component } from "react";
import {
  Card,
  CardBody,
  Row,
  Label,
  Input,
  FormGroup,
  Table,
  Col,
  CardTitle,
} from "reactstrap";
import Button from "reactstrap/lib/Button";
import CardHeader from "reactstrap/lib/CardHeader";
import axios from "axios";
import PrintModal from "./PrintModal";
import { toast, ToastContainer } from "react-toastify";
import SockJS from "sockjs-client";
import Stomp from "stompjs"


class Tchc extends Component {
  constructor(props) {
    super(props);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      trangthai: false,
      dataReques: [],
      dataSet: 0,
      isShowModal: false,
      dataUse: [],
      dataDate: [],
      dataEdit: [],
      dataDepartment:[],
      department:'',
      code: JSON.parse(localStorage.getItem("code"))
    };
  }
  componentDidMount() {
    this._fetchData()
    this._getDepartment()
    this._listenAddRequest()
  }
  // componentDidUpdate(prevState) {
  //   if(prevState.dataSet !== this.state.dataSet){
  //     if(this.state.dataSet === 1){
  //       this._fetchData()
  //     }
  //   }
  // }

  _listenAddRequest = () => {
    let self = this
    const { code } = this.state
    const socket = new SockJS('http://localhost:8989/sock-data')
    const stompClient = Stomp.over(socket)
    stompClient.connect({},function(connectionData){
      console.log('connect-ahihi',connectionData);
      stompClient.subscribe('/data/request/' + code, function(data){
        self._fetchData()
      })
    })
  }

  _fetchData = async () => {
    await axios
      .get("/request/not-handled", {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((response) => {
        console.log("res", response);
        this.setState({ dataRequest: response.data, dataSet: 0 });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  _getDepartment = async() =>{
    await axios
      .get("/department/fix-room", {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((response) => {
        console.log("res", response);
        this.setState({ dataDepartment: response.data})
      })
      .catch(function (error) {
        console.log(error)
      });
  }

  _viewCreatedDate = (date) => {
    //view status
    console.log("Day", date);
    var d = new Date(date);
    console.log("date", d);
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  _viewStatus = (status) => {
    switch (status) {
      case "WAIT_MANAGER":
        return "Chờ trưởng phòng duyệt";
      case "WAIT_DIRECTOR":
        return "Chờ giám đốc duyệt";
      case "WAIT_TCHC":
        return "Chờ tc-hc điều phối";
      default:
        break;
    }
  };

  _viewDataRequest = () => {
    const { dataRequest, trangthai} = this.state;
    if (dataRequest && dataRequest.length > 0) {
      return dataRequest.map((data, index) => {
        return (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{data.reason}</td>
            <td>{data.solution}</td>
            <td>{this._viewCreatedDate(data.createdDate)}</td>
            <td>{this._viewStatus(data.status)}</td>
            <td>
              <Button size="sm" onClick={() => this._doiTrangThai(data)} color="info" className="mr-2" disabled={trangthai}>
                Điều Phối
              </Button>
              <Button
                size="sm"
                onClick={() => this._setDataModal(data)}
                color="success"
              >
                In
              </Button>
            </td>
          </tr>
        );
      });
    }
  };

  _setDataModal = (data) => {
    const dateNow = new Date();
    let month = "" + (dateNow.getMonth() + 1);
    let day = "" + dateNow.getDate();
    let year = dateNow.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    const a = { day, month, year };
    this.setState({
      isShowModal: true,
      dataUse: data,
      dataDate: {...this.state.dataDate,day, month, year}
    });
  };

  render() {
    console.log('state',this.state);
    const { isShowModal, dataUse } = this.state;
    return (
      <div style={{ background: "LightCyan" }} className="content">
        <Row>
          <Col md="8">
            <Card className="abc">
              <CardHeader>
                <FormGroup row>
                  <Label md="4" sm={6} tag="h6">
                    Danh sách yêu cầu chỉnh sửa
                  </Label>
                </FormGroup>
              </CardHeader>
              <CardBody>
                <Table striped>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Lý Do</th>
                      <th>Nội dung đề suất</th>
                      <th>Ghi Chú</th>
                      <th>Tình Trạng</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{this._viewDataRequest()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">{this._viewEdit()}</Col>
        </Row>
        <ToastContainer />
        {isShowModal && (
          <PrintModal
            isShowModal={isShowModal}
            toggleModal={() => this.setState({ isShowModal: !isShowModal })}
            data={dataUse}
          />
        )}
      </div>
    );
  }

  _doiTrangThai = data => {
    this.setState({
      trangthai: !this.state.trangthai,
      dataEdit: data
    });
  };

  onChangeValue(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value,
    });
}

  _viewEdit() {
    const { dataEdit, dataDepartment } = this.state
    if (this.state.trangthai === true) {
      return (
        <Card className="abc">
          <CardHeader>
            <CardTitle tag="h3">YÊU CẦU SỮA CHỮA</CardTitle>
          </CardHeader>
          <CardBody>
            <FormGroup>
              <Label tag="h5">Lý Do</Label>
              <Input
                type="text"
                defaultValue={dataEdit.reason}
                placeholder="nhập lý do nhu cầu sửa chữa"
                disabled
                className="new-disabled"
              />
            </FormGroup>
            <FormGroup>
              <Label tag="h5">Nội dung đề xuất</Label>
              <Input
                type="text"
                defaultValue={dataEdit.solution}
                placeholder="Muốn làm gì với thiết bị đó"
                className="new-disabled"
                disabled
              />
            </FormGroup>
            <FormGroup>
              <Label tag="h5">Chọn Bộ Phận Kỹ Thuật</Label>
              <Input 
              type="select" 
              name="department" 
              id="exampleSelect"
              onChange = {this.onChangeValue}
              >
                <option>None</option>
                {dataDepartment.map((data,index)=>{
                  return <option value={data.code} key={index}>{data.name}</option>
                })}
              </Input>
            </FormGroup>
            <Button color="success" onClick={this.onSubmit}>
              Xác Nhận
            </Button>
            <Button onClick={() => this._doiTrangThai()}>Thoát</Button>
          </CardBody>
        </Card>
      );
    }
  }

  onSubmit = async event =>{
    event.preventDefault()
    const { department, dataEdit } = this.state
    if(department===''){
      toast.info("Hãy chọn bộ phận kỹ thuật muốn điều phối!")
    }
    else{
      const  request = dataEdit.code
      await axios
        .post(`/request/tchc/assign-request?department=${department}&request=${request}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("authorization")),
          },
        })
        .then((res) => {
          toast.success("Duyệt thành công")
          this._fetchData()
          this.setState({trangthai:false})
        })
        .catch((err) => {
          console.log("fail", err.response);
          toast.error("Duyệt thất bại")
        });
    }
    
  }

  _viewDataPrint = () => {
    return <div className="row p-4"></div>;
  };
}

export default Tchc;
