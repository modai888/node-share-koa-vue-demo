<template>
    <div class="gs-pane">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "pane",
        inject: [ 'resizablePane' ],
        props: {
            free: {
                type: Boolean,
                default: false
            },
            minWidth: Number,
            maxWidth: Number,
            minHeight: Number,
            maxHeight: Number
        },
        data() {
            return {}
        },

        created() {
            if ( !this.resizablePane ) {
                throw `Element 'Pane' must be nested in element 'ResizablePane'`
            }
        },
        mounted() {
            this.resizablePane.addPane(this);
            // if ( this.resizablePane.isStack ) {
            //     _size = this.$el.offsetHeight;
            //     this.$el.style.height = this.$el.offsetHeight + 'px';
            // } else {
            //     _size = this.$el.offsetWidth;
            //     this.$el.style.width = this.$el.offsetWidth + 'px'
            // }

            // when dom is rendered
            this.$nextTick(() => {
                let prop = this.resizablePane.isStack ? 'height' : 'width';
                let capitalProp = prop.slice(0, 1).toUpperCase() + prop.slice(1);

                this._minSize = Math.abs(this[ 'min' + capitalProp ] || this._getCssSize('min' + capitalProp));
                this._maxSize = Math.abs(this[ 'max' + capitalProp ] || this._getCssSize('max' + capitalProp));

                let defaultSize = (() => {
                    return this._getCssSize(prop) || this.$el[ 'offset' + capitalProp ]
                })();

                !this._minSize && (this._minSize = defaultSize);
                !this._maxSize && (this._maxSize = defaultSize);

                if ( this._minSize > this._maxSize ) {
                    let t = this._minSize;
                    this._minSize = this._maxSize;
                    this._maxSize = t;
                }
                // console.log(`min:${this._minSize}  max:${this._maxSize}`);

                this.$el.style[ prop ] = this._minSize + 'px';
                // this.$el.style[ 'min' + capitalProp ] = this._minSize + 'px';
                // this.$el.style[ 'max' + capitalProp ] = this._maxSize + 'px';
                this._size = this._minSize;
            })
        },
        beforeDestroy() {
            this.resizablePane.removePane(this);
        },
        methods: {
            _setSize(size) {
                if ( this.resizablePane._freePane !== this
                    && (this._minSize > size || this._maxSize < size) ) {
                    return false;
                }

                if ( this.resizablePane.isStack ) {
                    this.$el.style.height = size + 'px';
                } else {
                    this.$el.style.width = size + 'px';
                }
                this._size = size;
                return true;
            },
            _getCssSize(prop) {
                let styles = window.getComputedStyle(this.$el, null);
                return parseInt(styles[ prop ], 10) || 0;
            },

        }
    }
</script>


