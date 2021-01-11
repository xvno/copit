<template>
    <div class="container">
        <div
            v-for="item in itemList.children"
            :key="item.hash"
            :class="item.isTitle ? 'item title' : 'item'"
            @click="copy(item)"
        >
            {{ item.msg }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'NrList',
    props: ['itemList'],
    data() {
        return {};
    },
    methods: {
        copy(item) {
            if (!item.isTitle) {
                this.$copyText(item.msg);
                this.$emit('copied');
            }
        },
    },
    watch: {
        itemList() {
            this.$emit('resize');
        },
    },
};
</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-family: 'Yahe', 'Times New Roman', Times, serif;
    }
    .container .item {
        background-color: #8080ff;
        color: white;
        /* border: 1px solid #8080ff; */
        padding: 2px;
        font-size: 14px;
    }
    .container .item:hover {
        background-color: #ffffff;
        color: #8080ff;
        cursor: pointer;
    }

    .container .title {
        text-align: center;
    }
    .container .title {
        font-weight: bold;
        display: flex;
        flex-direction: row;
    }
    .container .title:before,
    .container .title:after {
        content: '';
        flex: 1 1;
        border-bottom: 1px solid #ffffff;
        margin: auto;
    }
    .container .title:before {
        margin-right: 10px;
    }
    .container .title:after {
        margin-left: 10px;
    }
    .container .title:hover {
        background-color: #8080ff;
        color: white;

        cursor: default;
    }
</style>
