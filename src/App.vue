<template>
    <div id="app" class="window">
        <div class="window-content">
            <div class="pane-group">
                <nav class="pane-mini sidebar app__sidebar" style="-webkit-app-region: drag;">
                    <ul>
                        <li class="avater sidebar__avater">
                            <img src="./assets/avater.jpg">
                        </li>
                        <li>
                            <router-link to="/home" active-class="active" class="sidebar__navitem">
                                <i class="iconfont iconfont--xxl active">&#xe61b;</i>
                                <i class="iconfont iconfont--xxl inactive">&#xe600;</i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/friends" active-class="active" class="sidebar__navitem" >
                                <i class="iconfont iconfont--xxl active">&#xe664;</i>
                                <i class="iconfont iconfont--xxl inactive">&#xe666;</i>
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/favorites" active-class="active" class="sidebar__navitem">
                                <i class="iconfont iconfont--xxl active">&#xe630;</i>
                                <i class="iconfont iconfont--xxl inactive">&#xe78c;</i>
                            </router-link>
                        </li>
                    </ul>
                </nav>
                <div class="pane">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'electron-vue-demo'
    }
</script>

<style>
    /* CSS */
</style>
