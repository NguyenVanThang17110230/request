import React, { Component } from 'react';
//import axios from 'axios';
import{Button} from "reactstrap";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
class TableDepartment extends Component {
    
    onClickEdit=()=>{
        this.props.onView();
        this.props.onCHangeEdit();
    }
    delete=()=> {
        var result = window.confirm("Are you sure you want to delete")
        if(result){
          var code = this.props.obj.code;
          axios
          .delete("/department/" + code)
          .then((res)=>{
            console.log(res.data);
            if(res.status===200){
              toast.success('delete success');
              setTimeout(function () {
                window.location.reload(1);
              },1000);
            }
            else
            {
              toast.error(`${res.data.message}`);
            }
          })
          .catch((err) => console.log(err));
        }
        else
        {
          console.log('vao day')
        }
    }
    render() {
        return (
            <tr>
                
                <td>
                    {this.props.obj.id}
                </td>
                <td>
                    {this.props.obj.code}
                </td>
                <td>
                    {this.props.obj.name}
                </td>
               
                <td>

                    <Button onClick={this.delete} size="sm" color="danger">Delete</Button>
                    <Button onClick={()=>this.onClickEdit()} size="sm" color="success">Edit</Button>
                    <ToastContainer />
                </td>
                
            </tr>
        );
    }
}

export default TableDepartment;