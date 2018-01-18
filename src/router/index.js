import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/home',
            name: 'home-page',
            component: require('@/components/HomePage').default
        },
        {
            path: '/friends',
            name: 'friends-page',
            component: require('@/components/FriendsPage').default
        },
        {
            path: '/favorites',
            name: 'favorites-page',
            component: require('@/components/FavoritesPage').default
        },
        {
            path: '*',
            redirect: '/home'
        }
    ]
})
