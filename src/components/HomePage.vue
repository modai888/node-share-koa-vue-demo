<template>
    <div class="window">
        <div class="window-content">
            <resizable-pane class="page">
                <pane class="page__sidebar">
                    <header class="sidebar__header">
                        <label class="search-box">
                            <input type="text" class="form-control" placeholder="搜索">
                        </label>
                        <button class="btn btn-mini btn-light">
                            <span class="icon icon-plus"></span>
                        </button>
                    </header>
                    <div class="sidebar__content">
                        <ul class="list-group recent-chats">
                            <li class="list-group-item chat-friend">
                                <img class="chat-friend__avator" src="../assets/3.jpg">
                                <div class="chat-friend__info">
                                    <strong class="chat-friend__name">天天向上</strong>
                                    <p class="chat-friend__msg">Lorem ipsum dolor sit amet.</p>
                                </div>
                            </li>
                            <li class="list-group-item chat-friend">
                                <img class="chat-friend__avator" src="../assets/2.jpg">
                                <div class="chat-friend__info">
                                    <strong class="chat-friend__name">快乐的小屋</strong>
                                    <p class="chat-friend__msg">Lorem ipsum dolor sit amet.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </pane>
                <pane class="page__content">
                    <header class="page__header">
                        微信聊天窗口
                    </header>
                    <div class="page__body">
                        <chat-message></chat-message>
                    </div>
                </pane>
            </resizable-pane>
        </div>
    </div>
</template>

<script>
    import ResizablePane from './shared/resizable-pane/resizable-pane'
    import Pane from './shared/resizable-pane/pane'
    import ChatMessage from './HomePage/ChatMessage'

    export default {
        name: "home-page",
        components: { ResizablePane, Pane, ChatMessage }
    }
</script>

<style>

</style>