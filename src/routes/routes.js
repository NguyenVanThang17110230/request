
import Icons from "views/Icons.js";
import Notifications from "views/Notifications.js";
import UserProfile from "views/UserProfile.js";
import Department from "views/Department.js";
import Maps from "views/Map.js"
var routes = [  
  {
    path: "/icons",
    name: "Manage users",
    rtlName: "الرموز",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/department",
    name: "Manage Department",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "tim-icons icon-bell-55",
    component: Department,
    layout: "/admin"
  }
];
export default routes;
