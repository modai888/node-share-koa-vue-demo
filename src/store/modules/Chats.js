const chatsApi = require('../../api/chats')

const mutations = {
    ADD_CHAT_MESSAGE(state, { content, self }) {
        let session = state.sessions.find(s => s.id === state.currentSessionId);
        if ( session ) {
            session.messages.push({
                self, content, date: Date.now()
            })
        }
    }
}

const actions = {
    SEND_CHAT_MESSAGE(store, { content, self }) {
        chatsApi.sendChatMessage(content, {}).then(() => {
            store.commit('ADD_CHAT_MESSAGE', { content: '哈哈', self: false })
        });
        store.commit('ADD_CHAT_MESSAGE', { content, self })
    }
}

const getters = {
    currentSession(state) {
        return state.sessions.find((s, i) => s.id === state.currentSessionId)
    }
};

export default {
    state: {
        // 当前用户
        user: {
            name: 'coffce',
            img: 'static/img/avater.jpg'
        },
        // 会话列表
        sessions: [
            {
                id: 1,
                user: {
                    name: '示例介绍',
                    img: 'static/img/2.jpg'
                },
                messages: [
                    {
                        content: 'Hello，这是一个基于Vue + Vuex + Webpack构建的简单chat示例，聊天记录保存在localStorge, 有什么问题可以通过Github Issue问我。',
                        date: Date.now()
                    }, {
                        content: '项目地址: https://github.com/coffcer/vue-chat',
                        date: Date.now()
                    }
                ]
            },
            {
                id: 2,
                user: {
                    name: 'webpack',
                    img: 'static/img/3.jpg'
                },
                messages: []
            }
        ],
        // 当前选中的会话
        currentSessionId: 1,
    },
    mutations,
    actions,
    getters
}
