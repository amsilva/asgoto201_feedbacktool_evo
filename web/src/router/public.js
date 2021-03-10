import LayoutAccess from "@/views/layouts/access/Access.vue";

import PageHome from "@/views/public/home/Home.vue";
import PageLogin from "@/views/public/login/Login";
import PageSignup from "@/views/public/signup/Signup";

export default [
  {
    path: "/",
    name: "Home",
    component: PageHome,
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Access",
    component: LayoutAccess,
    children: [
      {
        path: "/login",
        name: "Login",
        component: PageLogin
      },
      {
        path: "/signup",
        name: "SignUp",
        component: PageSignup
      }
    ]
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword"
    // component: ForgotPassword
  },
  {
    path: '*',
    redirect: "/login"
  }
];
