import Tchc from "views/Tchc.js";
import TchcComplete from "views/TchcComplete.js"
var routestchc = [
  {
    path: "/qlyc",
    name: "Quản Lý Yêu cầu",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Tchc,
    layout: "/tchc"
  },
  {
    path: "/qlht",
    name: "Yêu cầu đã xử lý",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: TchcComplete,
    layout: "/tchc"
  }
];
export default routestchc;