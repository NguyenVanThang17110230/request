import React, { Component } from "react";
import {
  Card,
  CardBody,
  Row,
  Label,
  FormGroup,
  Table,
  Col,
} from "reactstrap";
import Button from "reactstrap/lib/Button";
import CardHeader from "reactstrap/lib/CardHeader";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import PrintModal from "./PrintModal";
class TchcComplete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReques: [],
      dataSet: 0,
      code: JSON.parse(localStorage.getItem("code")),
      a: false,
      isShowModal: false,
      dataUse: [],
      dataDate: [],
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
        toast.success("Có 1 yêu cầu mới!")
      });
    });
  };
  _ok = (data) => {
    console.log("ok");
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
      .get("/request/get-all-request-finish", {
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
      default:
        break;
    }
  };
  //cancel request
  _cancelRequest = async (code) => {
    await axios
      .put("/request/reject/" + code, {
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((res) => {
        console.log("ok", res);
        if (res.status === 200) {
          toast.success("Từ chối thành công");
          this.setState({
            dataSet: 1,
          });
        }
      })
      .catch((err) => {
        console.log("fail", err.response);
        toast.error("Từ chối thất bại");
      });
  };
  //accept request
  _acceptRequest = async (code) => {
    await axios
      .post(`/request/fixer-finish-request?request=${code}`, {
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

  _setDataModal = (data) => {
    const dateNow = new Date();
    let month = "" + (dateNow.getMonth() + 1);
    let day = "" + dateNow.getDate();
    let year = dateNow.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    this.setState({
      isShowModal: true,
      dataUse: data,
      dataDate: {...this.state.dataDate,day, month, year}
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

  render() {
    console.log("state", this.state);
    const { isShowModal, dataUse } = this.state
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
}

export default TchcComplete;
