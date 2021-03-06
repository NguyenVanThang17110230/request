import React from "react";
import axios from "axios";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
import "react-toastify/dist/ReactToastify.css";
import { Redirect } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// reactstrap components
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
  ModalBody
} from "reactstrap";
import CardHeader from "reactstrap/lib/CardHeader";
import Button from "reactstrap/lib/Button";

class Notifications extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.onchangValue = this.onchangValue.bind(this);
    this.state = {
      dataRequest: [],
      isEdit:false,
      codeEdit: '',
      reason:'',
      solution:''
    };
  }

  componentDidMount() {
    this._fetchData();
  }

  onchangValue(event){
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value
    })
  }

  _changeStatus = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    });
  };

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

  _fetchData = async () => {
    await axios
      .get("/request/not-handled",{
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("authorization")),
        },
      })
      .then((response) => {
        console.log("res", response);
        this.setState({ dataRequest: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  //view date
  _viewCreatedDate = date =>{
  //view status
  console.log("Day",date);
  var d = new Date(date)
  console.log("date",d);
  var month = '' + (d.getMonth() + 1)
  var day = '' + d.getDate()
  var year = d.getFullYear()

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

    return [day,month,year].join('-');
  }
  _viewStatus = status =>{
    switch (status) {
      case 'WAIT_MANAGER':
        return "Chờ trưởng phòng duyệt"
      case 'WAIT_DIRECTOR':
        return "Chờ giám đốc duyệt"
      default:
        break;
    }
  }
  _updateRequest = async (data) => {
    this.setState({
      isEdit: true,
      reason: data.reason,
      solution: data.solution,
      codeEdit: data.code
    });
  };
  _viewDataRequest = () => {
    const { dataRequest } = this.state;
    if (dataRequest && dataRequest.length > 0) {
      return dataRequest.map((data, index) => {
        return (
          <tr key={index}>
            <td>{index+1}</td>
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
            </td>
          </tr>
        );
      });
    }
  };

  render() {
    if (!localStorage.getItem("authorization")) return <Redirect to="/login" />;
    return (
      <div style={{ background: "LightCyan" }} className="content">
        <div className="react-notification-alert-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
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
        <ToastContainer />
      </div>
    );
  }
}

export default Notifications;
