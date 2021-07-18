import Manager from "views/Manager.js";
var routesmanager = [
  {
    path: "/qlyc",
    name: "Quản Lý Yêu cầu",
    rtlName: "إخطارات",
    icon: "tim-icons icon-bell-55",
    component: Manager,
    layout: "/manager"
  },
//   {
//     path: "/suchua",
//     name: "Yêu cầu sữa chữa",
//     rtlName: "إخطارات",
//     icon: "tim-icons icon-bell-55",
//     component: Maps,
//     layout: "/user"
//   },
  // {
  //   path: "/user-profile",
  //   name: "Manage Category",
  //   rtlName: "ملف تعريفي للمستخدم",
  //   icon: "tim-icons icon-single-02",
  //   component: UserProfile,
  //   layout: "/user"
  // }
];
export default routesmanager;