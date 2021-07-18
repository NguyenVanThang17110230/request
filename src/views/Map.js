
import React from "react";
import axios from 'axios';
// react plugin for creating notifications over the dashboard
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableRowCheck from "components/TableRow/TableRowcheck.js";
import {Redirect } from "react-router-dom";
import Stomp from "stompjs"
//import history from "history.js";
// reactstrap components
//import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import {  
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Label,
  Input,
  FormGroup,
  FormText,
  CustomInput,
  Table,
  Col
} from "reactstrap";
import SockJS from "sockjs-client";
class Map extends React.Component {
  constructor(props) {
    super(props);
    
    this.onSubmit = this.onSubmit.bind(this);
    this.onchangValue = this.onchangValue.bind(this);
   
    this.state = {
      regexp : /^[0-9\b]+$/,
      regexp1 :/[’“”%&!’#√.*+?,;^${}()_`'"|[\]\\//]/,
      rex: /[0-9]/,
      solution:'',
      reason:'',
    }
  }
  
  onchangValue(event){
    var name = event.target.name;
    var value = event.target.value;
    this.setState({
      [name]: value
    })
  }
  componentDidMount() {
    axios.get('/api/theme/alltheme',{
        headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("authorization")),
          },
        })
        .then(response => {
            console.log(response.data.listtheme);
            this.setState({datalist: response.data.listtheme});
            console.log('daaaaaaaaaaaaaaaaaaaaaa');
            console.log(this.getFirstTheme());
            
        })
        .catch(function (error) {
            console.log(error);
        })
  }

  onSubmit(event){
    event.preventDefault()
   
    if(this.state.reason !==''&& this.state.solution!== '' ){

        axios.post("/request",{
          reason:this.state.reason,
          solution:this.state.solution
        },{
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("authorization")),
          },
        })
        .then((res) => {
          console.log("Res",res);
          if(res.status===201)
          {           
            console.log('yess');
            toast.success('Thành công')

          }
          else{
            toast.error('Lỗi')
          }
        })
        .catch(err => {toast.error(err.response.status);});
    }
    else{
      alert('fill all');
    }
        
     
  }

  _sendRequest = () =>{
    const socket = new SockJS('http://localhost:8989/sock-data')
    const stompClient = Stomp.over(socket)
    stompClient.send('/')
  }

  tabRowCheck(){
    return this.state.datacheck.map(function (object,i){
      return <TableRowCheck obj={object} key={i}/>;
    });
  }
  hienThiFormSave(){
    if(this.state.disabled===false){
      return(
        <Card>
          <CardHeader>
            <CardTitle tag="h3">LIST DOCUMENT DUPLICATE</CardTitle>
          </CardHeader>
          <CardBody>
            <Table striped>
              <thead>
                <tr>
                  <th>ID Document</th>
                  <th>Filename</th>
                  <th>CATEGORY</th>
                  <th>Message</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                         
                  {this.tabRowCheck()}
                                    
              </tbody>
            </Table>
              <Button disabled={this.state.disabled}  onClick={this.onSaveFile}>Save</Button>
              <Button disabled={this.state.disabled} onClick={()=>this.onCancelField()} >Cancel</Button>
          </CardBody>
        </Card>
      );
    }
  }
  render() {
    if (!localStorage.getItem('authorization')) return <Redirect to="/login" />
    return (
        <div style={{background: 'rgba(203,203,210,0.15)'}} className="content">
          <Row className="center-box">
            <ToastContainer />
            <Col md="8">
              <Card className="abc">
                <CardHeader>
                  <CardTitle tag="h3">
                    YÊU CẦU SỮA CHỮA</CardTitle>
                </CardHeader>
                <CardBody>
                  <FormGroup>
                    <Label tag="h5">Lý Do</Label>
                    <Input 
                      value={this.state.reason} 
                      onChange={this.onchangValue} 
                      type="textarea" 
                      name="reason"
                      className="text-fix"
                      rows={6}
                      id="" placeholder="nhập lý do nhu cầu sửa chữa"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label tag="h5">Nội dung đề xuất</Label>
                    <Input 
                      value={this.state.solution} 
                      onChange={this.onchangValue} 
                      type="textarea" 
                      name="solution" 
                      id=""
                      rows={6}
                      className="text-fix"
                      placeholder="Muốn làm gì với thiết bị đó" 
                    />
                  </FormGroup>
                  <Button onClick={this.onSubmit}>Gửi Yêu Cầu</Button>
               </CardBody>              
             </Card>
            </Col>
            <Col md="6">
              {this.hienThiFormSave()}
            </Col>
          </Row>
        </div>
    );
  }
}
export default Map;
