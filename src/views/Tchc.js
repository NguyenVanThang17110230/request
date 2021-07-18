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

class Tchc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      trangthai: false,
      dataReques: [],
      dataSet: 0,
      isShowModal: false,
      dataUse: [],
      dataDate: []
    };
  }
  componentDidMount() {
    this._fetchData();
  }
  // componentDidUpdate(prevState) {
  //   if(prevState.dataSet !== this.state.dataSet){
  //     if(this.state.dataSet === 1){
  //       this._fetchData()
  //     }
  //   }
  // }

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
  };

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
              <Button size="sm" onClick={this._doiTrangThai} color="success">
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
    console.log("abc", this.state);
    const { isShowModal, dataUse,dataDate } = this.state;
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

  _doiTrangThai = () => {
    this.setState({
      trangthai: !this.state.trangthai,
    });
  };

  _viewEdit() {
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
                value="Hư Quạt"
                onChange={this.onchangValue}
                type="text"
                name="authorname"
                id=""
                placeholder="nhập lý do nhu cầu sửa chữa"
              />
            </FormGroup>
            <FormGroup>
              <Label tag="h5">Nội dung đề xuất</Label>
              <Input
                value="Thay Quạt"
                onChange={this.onchangValue}
                type="text"
                name="note"
                id=""
                placeholder="Muốn làm gì với thiết bị đó"
              />
            </FormGroup>
            <FormGroup>
              <Label tag="h5">Chọn Bộ Phận Kỹ Thuật</Label>
              <Input type="select" name="select" id="exampleSelect">
                <option>Kỹ Thuật 1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </Input>
            </FormGroup>
            <Button color="success" onClick={this.onSubmit}>
              Xác Nhận
            </Button>
            <Button onClick={this._doiTrangThai}>Thoát</Button>
          </CardBody>
        </Card>
      );
    }
  }

  _viewDataPrint = () => {
    return <div className="row p-4"></div>;
  };
}

export default Tchc;
