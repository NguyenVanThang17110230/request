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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Button from "reactstrap/lib/Button";
import CardHeader from "reactstrap/lib/CardHeader";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

class RequestFail extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onchangValue = this.onchangValue.bind(this);
    this.state = {
      dataReques: [],
      dataSet: 0,
      code: JSON.parse(localStorage.getItem("code")),
      a: false,
      isEdit: false,
      codeEdit: '',
      reason:'',
      solution:''
    };
  }
  componentDidMount() {
    console.log("ahhihi");
    this._fetchData();
    this._listenAddRequest();
  }

  _listenAddRequest = () => {
    let self = this;
    const { code } = this.state;
    const socket = new SockJS("http://localhost:8989/sock-data");
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function (connectionData) {
      console.log("connect-ahihi", connectionData);
      stompClient.subscribe("/data/request/" + code, function (data) {
        self._fetchData();
      });
    });
  };

  componentDidUpdate(prevState) {
    if (prevState.dataSet !== this.state.dataSet) {
      if (this.state.dataSet === 1) {
        this._fetchData();
      }
    }
  }

  _fetchData = async () => {
    await axios
      .get("/request/get-all-request-faild-by-employee", {
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
  };
  //view date
  _viewCreatedDate = (date) => {
    //view status
    var d = new Date(date);
    var month = "" + (d.getMonth() + 1);
    var day = "" + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  };

  _changeStatus = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

  onchangValue(event){
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  _viewModalEdit = () => {
    const { isEdit, reason, solution } = this.state;
    return (
      <Modal className="modal-edit" isOpen={isEdit} toggle={() => this._changeStatus()}>
        <ModalHeader tag="h4" toggle={() => this._changeStatus()}>
          PHIẾU ĐỀ XUẤT
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label tag="h5">Lý Do</Label>
            <Input
              value={reason}
              onChange={this.onchangValue}
              type="textarea"
              name="reason"
              className="text-fix"
              rows={6}
              id=""
              placeholder="nhập lý do nhu cầu sửa chữa"
            />
          </FormGroup>
          <FormGroup>
            <Label tag="h5">Nội dung đề xuất</Label>
            <Input
              value={solution}
              onChange={this.onchangValue}
              type="textarea"
              name="solution"
              id=""
              rows={6}
              className="text-fix"
              placeholder="Muốn làm gì với thiết bị đó"
            />
          </FormGroup>
          <Button onClick={this.onSubmit}>Chỉnh sửa</Button>
        </ModalBody>
      </Modal>
    );
  };

  onSubmit = async event =>{
    event.preventDefault();
    const { reason, solution, codeEdit} = this.state
    await axios.put("/request/"+ codeEdit,{
      reason,
      solution
    },{
      headers: {
        "Content-Type": "application/json",
        Authorization: JSON.parse(localStorage.getItem("authorization")),
      },
    })
    .then((res) => {
      if(res.status===204)
      {           
        toast.success('Thành công')
        this._fetchData()
        this.setState({
          isEdit:false,
        })
      }
      else{
        toast.error('Lỗi')
      }
    })
    .catch(err => {toast.error(err.response.status);});

  }

  _viewStatus = (status) => {
    switch (status) {
      case "WAIT_MANAGER":
        return "Chờ trưởng phòng duyệt";
      case "WAIT_DIRECTOR":
        return "Chờ giám đốc duyệt";
      case "FIXING":
        return "Bộ phận kỹ thuật xử lý";
      case "FINISHED":
        return "Đã xử lý";
      case "FAILED":
        return "Cần chỉnh sửa";
      default:
        break;
    }
  };
  //cancel request
  _updateRequest = async (data) => {
    this.setState({
      isEdit: true,
      reason: data.reason,
      solution: data.solution,
      codeEdit: data.code
    });
  };
  //accept request
  _acceptRequest = async (code) => {
    await axios
      .post("/request/resend/" + code, {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((res) => {
        console.log("ok", res);
        if (res.status === 200) {
          toast.success("Duyệt thành công");
          this._fetchData();
        }
      })
      .catch((err) => {
        console.log("fail", err.response);
        toast.error("Duyệt thất bại");
      });
  };

  _viewDataRequest = () => {
    const { dataRequest } = this.state;
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
              <Button
                size="sm"
                className="mr-2"
                onClick={() => this._updateRequest(data)}
                color="danger"
              >
                Chỉnh sửa
              </Button>
              <Button
                size="sm"
                onClick={() => this._acceptRequest(data.code)}
                color="success"
              >
                Gửi yêu cầu
              </Button>
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    console.log("state", this.state);
    return (
      <div style={{ background: "LightCyan" }} className="content">
        <ToastContainer />
        <Row>
          <Col md="10">
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
                      <th>Ngày tạo</th>
                      <th>Tình Trạng</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>{this._viewDataRequest()}</tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this._viewModalEdit()}
        
      </div>
    );
  }
}
export default RequestFail;
