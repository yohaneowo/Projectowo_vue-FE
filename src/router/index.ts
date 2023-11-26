import { createRouter, createWebHistory } from "vue-router"
import gameRanking from "../components/uidStorage/gameRanking.vue"
import specificGameDisplayPlayer from "../components/uidStorage/specificGamePlayerDisplay.vue"
import playerGamesDisplay from "../components/uidStorage/playerGamesDisplay.vue"
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: "uidStorage",
      path: "/uidStorage",
      children: [
        {
          name: "gameRanking",
          path: "gameRanking",
          component: gameRanking,
          props: true
        },
        {
          name: "specificGameDisplayPlayer",
          path: "game/:gameId/userList",
          component: specificGameDisplayPlayer,
          props: true
        },
        {
          name: "PlayerGamesDisplay",
          path: "user/:userId/gameList",
          component: playerGamesDisplay,
          props: true
        }
      ],
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/uidStorage.vue")
    }
  ]
})

export default router
