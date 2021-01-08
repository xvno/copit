<template>
    <div class="container">
        <div
            v-for="item in itemList.children"
            :key="item"
            class="item"
            @click="copy(item)"
        >
            {{ item }}
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
            this.$copyText(item);
            this.$emit('copied');
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
    }
    .container .item {
        background-color: #aaaaaa;
        color: white;
        border: 1px solid #aaaaaa;
        padding: 2px;
        font-size: 14px;
    }
    .container .item:hover {
        background-color: #333333;
        cursor: pointer;
    }
</style>
