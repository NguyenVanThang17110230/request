
import Notifications from "views/Notifications.js";
import Maps from "views/Map.js"
import Manager from "views/Manager.js";
import test from "views/test.js";
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
];
export default routesuser;
