import LayoutSystem from "@/views/layouts/system/System.vue";

// import PageHome from "@/views/system/home/Home.vue";
import PageProfile from "@/views/system/profile/Profile.vue";
import PageProfileView from "@/views/system/profile/ProfileView.vue";
import PageUsers from "@/views/system/users/Users.vue";
import PageUserList from "@/views/system/users/UserList.vue";
import PageUserForm from "@/views/system/users/UserForm.vue";
import PageSquads from "@/views/system/squads/Squads.vue";
import PageSquadList from "@/views/system/squads/SquadList.vue";
import PageSquadForm from "@/views/system/squads/SquadForm.vue";
import PageEvaluations from "@/views/system/evaluations/Evaluations.vue";
import PageEvaluationList from "@/views/system/evaluations/EvaluationList.vue";
import PageEvaluationForm from "@/views/system/evaluations/EvaluationForm.vue";
import PageEvaluationResult from "@/views/system/evaluations/EvaluationResult.vue";
import PageEvaluationRate from "@/views/system/evaluations/EvaluationRate.vue";

export default [
  {
    path: "/dashboard",
    component: LayoutSystem,
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        // component: PageHome,
        component: PageProfile,
        meta: {
          restrict: true
        },
        children: [
          {
            path: "/dashboard",
            name: "DashboardProfile",
            component: PageProfileView,
            meta: {
              restrict: true
            }
          }
        ]
      },
      {
        path: "/profile",
        name: "Profile",
        component: PageProfile,
        children: [
          {
            path: "/profile",
            name: "ProfileView",
            component: PageProfileView,
            meta: {
              restrict: true
            }
          }
        ]
      },
      {
        path: "/users",
        name: "Users",
        component: PageUsers,
        children: [
          {
            path: "/users",
            name: "UserList",
            component: PageUserList,
            meta: {
              restrict: true
            }
          },
          {
            path: "/users/form",
            name: "UserForm",
            component: PageUserForm,
            meta: {
              restrict: true
            }
          }
        ]
      },
      {
        path: "/squads",
        name: "Squads",
        component: PageSquads,
        children: [
          {
            path: "/squads",
            name: "SquadList",
            component: PageSquadList,
            meta: {
              restrict: true
            }
          },
          {
            path: "/squads/form",
            name: "SquadForm",
            component: PageSquadForm,
            meta: {
              restrict: true
            }
          }
        ]
      },
      {
        path: "/evaluations",
        name: "Evaluation",
        component: PageEvaluations,
        meta: {
          restrict: true
        },
        children: [
          {
            path: "/evaluations",
            name: "EvaluationList",
            component: PageEvaluationList,
            meta: {
              restrict: true,
              profiles: [99]
            },
          },
          {
            path: "/evaluations/Form",
            name: "EvaluationForm",
            component: PageEvaluationForm,
            meta: {
              restrict: true,
              profiles: [99]
            },
          },
          {
            path: "/evaluations/results",
            name: "EvaluationResult",
            component: PageEvaluationResult,
            meta: {
              restrict: true
            }
          },
          {
            path: "/evaluations/rate",
            name: "EvaluationRate",
            component: PageEvaluationRate,
            meta: {
              restrict: true
            }
          }
        ]
      },
      // {
      //   path: "/evaluations/new",
      //   name: "EvaluationsForm",
      //   component: PageEvaluationNew
      // },
      // {
      //   path: "/config",
      //   name: "Config",
      //   component: PageHome,
      //   meta: {
      //     restrict: true
      //   }
      // }
    ]
  }
];
