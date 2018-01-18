<template>
    <div class="resizable-pane" :class="{'resizable-pane--stack':isStack, 'resizing': isResizing}">
        <div class="resizable-pane__panes">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    let splitterId = 0;
    const GS_PANE_FREE = 'gs-pane--free';
    const Direction = {
        horizontal: {
            t3d: [ 'translate3d(', 'px, 0px, 0px)' ]
        },
        vertical: {
            t3d: [ 'translate3d(0px, ', 'px, 0px)' ]
        }
    }

    export default {
        name: "resizable-pane",
        data() {
            return {
                panes: [],
                isResizing: false
            }
        },
        provide() {
            return {
                resizablePane: this
            }
        },
        props: {
            isStack: {
                type: Boolean,
                default: false
            }
        },
        created() {
            this._dir = Direction[ this.isStack ? 'vertical' : 'horizontal' ]
        },
        mounted() {
            this._bindMouseEvent();
            window.addEventListener('resize', this._updateSplittersPosition)
        },
        beforeDestroy() {
            window.removeEventListener('resize', this._updateSplittersPosition)
        },
        methods: {
            addPane(pane) {
                this.panes.push(pane);
                if ( pane.free ) {
                    this._freePane = pane
                }

                if ( this.panes.length > 1 ) {
                    // TODO: 是否需要优化
                    this.$nextTick(() => {
                        let i = this.panes.indexOf(pane);
                        if ( i > 0 ) this._addSplitter(this.panes[ i - 1 ], pane);
                    })
                }

                this._updatePanePos();
            },
            removePane(pane) {
                let i = this.panes.indexOf(pane);
                if ( i > -1 ) {
                    this.panes.splice(i, 1);
                    let splitter = pane._splitter;
                    if ( splitter && splitter.classList.contains('pane-splitter') ) {
                        this.$el.removeChild(splitter);
                        delete this._splitters[ splitter.id ];
                    }
                    this._updatePanePos();
                }
            },

            _validatePane() {

            },
            _addSplitter(prePane, nextPane) {
                let splitter = document.createElement('div');
                let id = 'pane-splitter-' + ++splitterId;
                splitter.id = id;
                splitter.classList.add('pane-splitter');

                let pos = 0, styles;
                if ( this.isStack ) {
                    splitter.classList.add('pane-splitter--stack');
                    pos = nextPane.$el.offsetTop - splitter.offsetHeight / 2;
                    styles = {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: '1px',
                        transform: this._getTransform(pos),
                        cursor: 'ns-resize'
                    };
                } else {
                    pos = nextPane.$el.offsetLeft - splitter.offsetWidth / 2;
                    styles = {
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: '1px',
                        transform: this._getTransform(pos),
                        cursor: 'ew-resize'
                    };
                }
                this._setStyles(splitter, styles);

                (this._splitters || (this._splitters = {}))[ id ] = { pos, prePane, nextPane };
                nextPane._splitter = splitter;

                this.$el.appendChild(splitter);
            },
            _bindMouseEvent(splitter) {
                this.$el.addEventListener('mousedown', this._onMouseDown);
                this.$el.addEventListener('mousemove', this._onMouseMove);
                this.$el.addEventListener('mouseup', this._onMouseUp);
                this.$el.addEventListener('mousecancel', this._onMouseCancel);
            },
            _onMouseDown(e) {
                if ( !this._splitters[ e.target.id ] ) return;

                this._curSplitter = e.target;
                this._pos = {
                    orgX: e.pageX,
                    orgY: e.pageY,
                    lastX: e.pageX,
                    lastY: e.pageY
                };
                this.isResizing = true;
                // console.log('down: ' + e.pageX)
            },
            _onMouseMove(e) {
                if ( !this._curSplitter ) return;
                let data = this._splitters[ this._curSplitter.id ];
                // console.log('move: ' + e.pageX)

                let _pos = 0, _delta = 0;
                if ( this.isStack ) {
                    _delta = e.pageY - this._pos.lastY
                } else {
                    _delta = e.pageX - this._pos.lastX;
                }

                _pos = data.pos + _delta;

                let ret = true;
                if ( !data.prePane._setSize(data.prePane._size + _delta)
                    || !data.nextPane._setSize(data.nextPane._size - _delta) ) {
                    // this._onMouseUp(e);
                    return;
                }
                this._curSplitter.style.transform = this._getTransform(_pos);

                this._pos.lastX = e.pageX;
                this._pos.lastY = e.pageY;
                data.pos = _pos
            },
            _onMouseUp(e) {
                if ( !this._curSplitter ) return;
                this._curSplitter = null;
                this._pos = null;
                this.isResizing = false;
                // console.log('up: ' + e.pageX)
            },
            _setStyles(elem, styles) {
                if ( styles ) {
                    Object.keys(styles).forEach((prop) => {
                        elem.style[ prop ] = styles[ prop ]
                    })
                }
            },
            _updatePanePos() {
                let len = this.panes.length;
                if ( !len ) return;

                this._freePane = null;
                for ( let i = 0; i < len; i++ ) {
                    let pane = this.panes[ i ];
                    if ( pane.free && !this._freePane ) {
                        this._freePane = pane;
                    }
                    pane.$el.classList.remove(GS_PANE_FREE);
                }

                if ( !this._freePane ) {
                    this._freePane = this.panes[ this.panes.length - 1 ];
                }

                this._freePane.$el.classList.add(GS_PANE_FREE);
            },
            _getTransform(pos) {
                return this._dir.t3d[ 0 ] + pos + this._dir.t3d[ 1 ]
            },
            _updateSplittersPosition() {
                let splitters = this._getChildren(this.$el, el => {
                    return el.classList.contains('pane-splitter')
                });

                let len = splitters.length;
                while ( len-- ) {
                    let splitter = splitters[ len ];
                    let data = this._splitters[ splitter.id ];
                    if ( data && data.nextPane ) {
                        let pos = 0;
                        if ( this.isStack ) {
                            pos = data.nextPane.$el.offsetTop - splitter.offsetHeight / 2;
                        } else {
                            pos = data.nextPane.$el.offsetLeft - splitter.offsetWidth / 2;
                        }

                        data.pos = pos;
                        splitter.style.transform = this._getTransform(pos);

                    }
                }
            },
            _getChildren(el, filter) {
                let nodes = Array.prototype.slice.call(el.childNodes);
                let ret = [];
                for ( let i = 0, len = nodes.length; i < len; i++ ) {
                    let node = nodes[ i ];
                    if ( node.nodeType !== 1 ) continue;
                    if ( filter(node) ) {
                        ret.push(node)
                    }
                }
                return ret;
            }
        }
    }
</script>
