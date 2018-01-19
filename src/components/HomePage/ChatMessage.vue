<template>
    <resizable-pane :is-stack="true" class="chat-view">
        <pane :free="true" class="chat-view__messages"
              v-scroll-bottom="session.messages">
            <ul v-if="session">
                <li v-for="(item , i) in session.messages">
                    <p class="time" v-if="msgInterval(i) > 20">
                        <span>{{ item.date | time }}</span>
                    </p>
                    <div class="main" :class="{ self: item.self }">
                        <img class="avatar" width="30" height="30" :src="item.self ? user.img : session.user.img"/>
                        <div class="text">{{ item.content }}</div>
                    </div>
                </li>
            </ul>
        </pane>
        <pane class="chat-view__input">
            <textarea placeholder="按CTRL键发送消息" v-model="message" @keydown.enter="send"/>
        </pane>
    </resizable-pane>
</template>

<script>
    import Vue from 'vue'
    import ResizablePane from '../shared/resizable-pane/resizable-pane'
    import Pane from '../shared/resizable-pane/pane'

    export default {
        name: "chat-message",
        components: { ResizablePane, Pane },
        data() {
            return {
                message: ''
            }
        },
        computed: {
            user() {
                return this.$store.state.Chats.user;
            },
            session() {
                return this.$store.getters.currentSession;
            }
        },
        methods: {
            send(e) {
                if ( e.ctrlKey ) {
                    this.message += '\n';
                    return;
                }

                if ( !this.message && !e.ctrlKey ) {
                    e.preventDefault();
                    return false;
                }

                if ( this.message ) {
                    e.preventDefault();
                    this.$store.dispatch('SEND_CHAT_MESSAGE', {
                        self: true, content: this.message
                    });
                    this.message = '';
                }
            },
            msgInterval(i) {
                if ( i < 1 ) return 1000;
                let messages = this.session.messages;
                let delta = new Date(messages[ i ].date).getTime() - new Date(messages[ i - 1 ].date).getTime()
                return Math.ceil(delta / 1000)
            }
        },
        filters: {
            // 将日期过滤为 hour:minutes
            time(date) {
                if ( typeof date === 'string' || typeof date === 'number' ) {
                    date = new Date(date);
                }
                return date.getHours() + ':' + date.getMinutes();
            }
        },
        directives: {
            // 发送消息后滚动到底部
            'scroll-bottom': {
                inserted: function (el) {
                    Vue.nextTick(() => {
                        el.scrollTop = el.scrollHeight - el.clientHeight;
                    })
                },
                componentUpdated: function componentUpdated(el) {
                    el.scrollTop = el.scrollHeight - el.clientHeight;
                }
            }
        }
    }
</script>
