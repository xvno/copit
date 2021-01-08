<template>
    <div id="wrapper">
        <main ref="box" @mouseleave="hideUp()">
            <div class="row">
                <div
                    class="mag"
                    v-for="item in xdata"
                    data-hash="{item.hash}"
                    :key="item.hash"
                    @mouseenter="showUp(item)"
                >
                    {{ item.mag }}
                </div>
                <!-- <div class="mag close" @click="getSize()">...</div> -->
                <div class="mag close" @click="close()">X</div>
            </div>
            <div class="row">
                <nr-list
                    :itemList="itemList"
                    v-on:copied="hideUp()"
                    v-on:resize="resize()"
                ></nr-list>
            </div>
        </main>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>是否要退出?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="close">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const { ipcRenderer } = require('electron');
ipcRenderer.on('SYS', (event, arg) => {
    console.log(arg);
});
import { md5 } from 'SRC/utils/hashing.js';
import NrList from './NrList.vue';

export default {
    name: 'landing-page',
    components: { NrList },
    data() {
        return {
            dialogVisible: false,
            itemList: [],
            narrating: [
                {
                    mag: '需求确认',
                    children: [
                        '您好，大众工匠很高兴为您服务，请问有什么可以帮您？',
                        '请问您家的面积大概是多少呢？',
                        '请问家里有需要重点打扫的区域吗？',
                        '家里的清洁情况怎么样呢，有没有重油污、重水垢呢？',
                        '方便的话可以给我拍个照片，可以更加准确的确认适合您需求的产品奥~',
                        '请问家里是否有家具呢？',
                        '请问您家里的油烟机是什么品牌的呢？',
                        '请稍等一会，马上为您查询，为避免等待断线，您可以留下您的联系方式，以便客服在核对信息的时候可以联系到您奥~',
                        '非常抱歉，请您再给我一些时间查询一下您的问题，您再耐心等待一下下哦~',
                    ],
                },
                {
                    mag: '提供产品',
                    children: [
                        '根据您的房屋情况，我推荐您可以购买**服务哦',
                        '目前**服务活动价只需要**元，建议您尽快抢购，不要错过活动哦~',
                        '近期活动力度比较大，为了避免您错过活动，建议您可以先购买，我这边帮您保留订单，后期您确定了时间再次联系',
                    ],
                },
                {
                    mag: '预约验券',
                    children: [
                        '请您提供需要预约的服务内容、详细服务地址、联系电话、服务时间，帮您进行预约',
                        '请您提供一下您团购的券码以及需要预约的服务内容、详细服务地址精确到门牌号、联系电话、服务时间，帮您进行预约',
                        '请您提供下单手机号或订单编号为您查询',
                        '请问怎么称呼您？',
                        '请问您对师傅的性别有要求吗',
                        '辛苦您提供一下详细地址，精确到门牌号',
                        '近期活动力度比较大，为了避免您错过活动，建议您可以先购买，我这边帮您保留订单，后期您确定了时间再次联系我',
                    ],
                },
                {
                    mag: '促成下单',
                    children: [
                        '目前您可以体验一下新人优惠，感受一下我们的专业服务',
                        '如果您之前已经享受过新人优惠也可以更换手机号下单奥',
                        '您放心，我们的工匠师傅都是经过专业培训的，每一位师傅都是拥有同样的服务标准/协商其他时间',
                        '因为目前师傅的时间实时更新，为了避免时间被其他用户预约了，建议您还是可以提前1-3天预约哦',
                        '因为师傅的时间实时更新，为了避免师傅的时间被其他用户预约了，您看现在方便我帮您预约可以吗？',
                        '近期活动力度比较大，为了避免您错过活动，建议您可以先购买，我这边帮您保留订单，后期您确定了时间再次联系我们直接帮您安排师傅就可以了',
                        '那建议您可以先购买（除接入订单），我这边帮您保留订单，后期您确定了时间再次联系我们直接帮您安排师傅就可以了',
                    ],
                },
                {
                    mag: '唤醒结束',
                    children: [
                        '您好，请问还有其他可以帮您的吗？',
                        '不客气，这是我们应该做的，为您服务是我的荣幸。',
                        '感谢您的意见与建议，我们会将此问题反馈给相关部门，希望您能一如既往的支持我们。',
                        '感谢您对我们工作的监督与支持，我们会继续努力，为您提供更贴心的服务体验哒。',
                        '您好，由于长时间未回复，即将结束和您的对话，如果有其他疑问，欢迎您再次咨询，祝您生活愉快，再见',
                        '感谢您对大众工匠的支持，期待与您再次相遇~',
                        '感谢您对我服务的认可，最近天气逐渐转凉，您注意保暖，预防感冒哦',
                    ],
                },
                {
                    mag: '致歉承担',
                    children: [
                        '非常抱歉给您带来不好的消费体验了，您先消消气，把问题交给我为您处理可以吗？',
                        '您的心情我非常能够理解，您不要着急，你方便详细描述一下当时具体发生的问题吗？',
                        '请您放心，您的问题我们会为您透妥善处理的，还请您先消消气',
                    ],
                },
                {
                    mag: '修改订单',
                    children: [
                        '请您提供预约服务的手机号码，帮您查询一下订单。',
                        '请您提供一下修改后的服务地址，客服帮您修改订单',
                        '请问您是想指定哪位师傅服务？客服帮您修改',
                        '查询到您的订单可以帮您修改到***，您看可以吗，如果可以，客服马上帮您操作修改奥',
                        '如您需要增加服务时长，可以现场扫描师傅的二维码进行补单就可以啦。',
                    ],
                },
                {
                    mag: '取消订单',
                    children: [
                        '请您提供预约服务的手机号码，帮您查询一下订单。',
                        '查询到您是自己在平台下单的，客服没有权限无法帮您操作取消订单，如您确认取消订单，客服帮您取消师傅的安排，您的订单退款需要您在****申请退款。',
                        '您的订单已为您备注取消订单，不会为您安排师傅上门服务了，由于客服无法为您退款，辛苦您记得联系下单平台申请退款',
                        '您的订单已为您操作取消，不会为您安排师傅上门服务了，请您联系您的下单平台申请退款即可',
                        '您可以在我的订单中申请退款',
                        '我司平台的标准化服务，定价合理透明，服务流程规范，整体性价比远高于市面上的其他产品。若之前有带给过您不好的体验，我们将竭力',
                    ],
                },
            ],
        };
    },
    created() {
        this.$on('COPIED', function () {});
    },
    methods: {
        open(link) {
            this.$electron.shell.openExternal(link);
        },
        showUp(mag) {
            console.log(mag);
            this.hideUp();
            this.itemList = mag;
        },
        hideUp() {
            this.itemList = [];
        },
        showCloseDialogue() {
            this.dialogVisible = true;
        },
        close() {
            ipcRenderer.send('USER', 'CLOSE');
        },
        getSize() {
            let rect = this.appdom.getClientRects()[0];
            ipcRenderer.send('FRAME', `${rect.width},${rect.height}`);
        },
        resize() {
            setTimeout(() => {
                let box = this.$refs['box'];
                let msg = `${box.clientWidth}, ${box.clientHeight}`;
                console.log('resized: ... ', msg);
                ipcRenderer.send('RESIZE', msg);
            });
        },
    },
    computed: {
        xdata() {
            const dataHashed = {};
            this.narrating.forEach((item) => {
                let hash = md5(item.mag);
                console.log(hash);
                dataHashed[hash] = {
                    hash,
                    ...item,
                };
            });
            return dataHashed;
        },
        appdom() {
            return document.getElementById('app');
        },
    },
};
</script>

<style>
    @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
        background: radial-gradient(
            ellipse at top left,
            rgba(255, 255, 255, 1) 40%,
            rgba(229, 229, 229, 0.9) 100%
        );
        height: 100vh;
        width: 100vw;
    }

    #logo {
        height: auto;
        margin-bottom: 20px;
        width: 420px;
    }

    main {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .mag {
        /* display: inline-block; */
        color: white;
        font-size: 14px;
        line-height: 16px;
        padding: 4px 5px;
        background-color: #aaaaaa;
        border: 1px solid #cccccc;
        cursor: pointer;
        float: left;
    }
    .mag:hover {
        background-color: #333333;
    }
    .mag.close {
        float: right;
    }
    .row {
        background-color: #aaaaaa;
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }
</style>
