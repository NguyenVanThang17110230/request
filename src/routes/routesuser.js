
import Notifications from "views/Notifications.js";
import Maps from "views/Map.js"
import RequestFail from "views/RequestFail.js";
var routesuser = [
  {
    path: "/qlkn",
    name: "Quản Lý Yêu cầu",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Notifications,
    layout: "/user"
  },
  {
    path: "/suchua",
    name: "Yêu cầu sữa chữa",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Maps,
    layout: "/user"
  },
  {
    path: "/fail",
    name: "Yêu cầu thất bại",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: RequestFail,
    layout: "/user"
  },
];
export default routesuser;
