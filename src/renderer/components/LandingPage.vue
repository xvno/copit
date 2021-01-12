<template>
    <div id="wrapper">
        <main ref="box" @mouseleave="hideUp()">
            <div class="row">
                <div
                    class="mag"
                    v-for="item in xdata"
                    :data-hash="item.mag"
                    :key="item.hash"
                    @mouseenter="showUp(item)"
                    :active="item.active"
                >
                    {{ item.mag }}
                </div>
                <!-- <div class="mag close" @click="getSize()">...</div> -->
                <div class="mag close" @click="close()">
                    <i class="el-icon-close"></i>
                </div>
            </div>
            <div class="row" style="-webkit-app-region: no-drag">
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
                    mag: '常用话术',
                    children: [
                        { msg: '开头语', isTitle: true },
                        {
                            msg: '您好，大众工匠，请问有什么可以帮您？',
                            isTitle: false,
                        },
                        { msg: '唤醒语', isTitle: true },
                        {
                            msg: '您好，请问还有其他可以帮您的吗？',
                            isTitle: false,
                        },
                        { msg: '您好，请问您还在吗？', isTitle: false },
                        {
                            msg:
                                '您好，由于长时间未回复，即将结束和您的对话，如果有其他疑问，欢迎您再次咨询，祝您生活愉快，再见',
                            isTitle: false,
                        },
                        { msg: '承接语', isTitle: true },
                        { msg: '请稍等，马上为您查询', isTitle: false },
                        {
                            msg:
                                '非常抱歉，请您再给我一些时间查询一下您的问题，您再耐心等待一下下哦~',
                            isTitle: false,
                        },
                        { msg: '结束语', isTitle: true },
                        {
                            msg:
                                '不客气，这是我们应该做的，为您服务是我的荣幸。',
                            isTitle: false,
                        },
                        {
                            msg:
                                '感谢您的意见与建议，我们会将此问题反馈给相关部门，希望您能一如既往的支持我们。',
                            isTitle: false,
                        },
                        {
                            msg:
                                '感谢您对我们工作的监督与支持，我们会继续努力，为您提供更贴心的服务体验哒。',
                            isTitle: false,
                        },
                        {
                            msg: '感谢您对大众工匠的支持，期待与您再次相遇~',
                            isTitle: false,
                        },
                        {
                            msg:
                                '感谢您对我服务的认可，最近天气逐渐转凉，您注意保暖，预防感冒哦',
                            isTitle: false,
                        },
                        { msg: '确认需求', isTitle: true },
                        { msg: '请问您家的面积大概是多少呢？', isTitle: false },
                        {
                            msg: '请问家里有需要重点打扫的区域吗？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '家里的清洁情况怎么样呢，有没有重油污、重水垢呢？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '方便的话可以给我拍个照片，可以更加准确的确认适合您需求的产品奥~',
                            isTitle: false,
                        },
                        { msg: '请问家里是否有家具呢？', isTitle: false },
                        {
                            msg: '请问您家里的油烟机是什么品牌的呢？',
                            isTitle: false,
                        },
                        { msg: '致歉承担', isTitle: true },
                        {
                            msg:
                                '非常抱歉给您带来不好的消费体验了，您先消消气，把问题交给我为您处理可以吗？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您的心情我非常能够理解，您不要着急，你方便详细描述一下当时具体发生的问题吗？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '请您放心，您的问题我们会为您透妥善处理的，还请您先消消气',
                            isTitle: false,
                        },
                        { msg: '发票问题', isTitle: true },
                        {
                            msg:
                                '我司订单服务完成后可开具发票，您直接微信小程序搜索大众工匠在我的订单里面可直接开具电子发票，发票内容为服务费。',
                            isTitle: false,
                        },
                        { msg: '师傅上门评估话术', isTitle: true },
                        {
                            msg:
                                '您好，工匠师傅上门后会为您做一个评估，告知您大概需要多长时间的，因为每个人的房屋真实情况不同，他会和您确认服务范围和区域的',
                            isTitle: false,
                        },
                        { msg: '自主下单修改地址', isTitle: true },
                        {
                            msg:
                                '您好，非常抱歉，目前服务地址暂时无法直接进行修改，建议您可以取消订单，重新下单。',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '预约下单',
                    children: [
                        { msg: '预约验券', isTitle: true },
                        {
                            msg:
                                '您好，您购买团购服务后，只需要将您的预约信息（手机号、时间、地址、团购券码）发送客服即可完成预约哦~目前优惠力度比较大，您看需要现在帮您预约吗？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您好，因预约量较大建议您提前1~2天预约，近期优惠力度也比较大，您看需要现在帮您预约吗？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '请您提供需要预约的服务内容、详细服务地址、联系电话、服务时间，帮您进行预约',
                            isTitle: false,
                        },
                        {
                            msg:
                                '请您提供一下您团购的券码以及需要预约的服务内容、详细服务地址精确到门牌号、联系电话、服务时间，帮您进行预约',
                            isTitle: false,
                        },
                        {
                            msg: '请您提供下单手机号或订单编号为您查询',
                            isTitle: false,
                        },
                        { msg: '请问怎么称呼您？', isTitle: false },
                        { msg: '请问您对师傅的性别有要求吗', isTitle: false },
                        {
                            msg: '辛苦您提供一下详细地址，精确到门牌号',
                            isTitle: false,
                        },
                        {
                            msg:
                                '辛苦您提供一下购买的门店及券码，可以在美团订单中查看哦',
                            isTitle: false,
                        },
                        { msg: '提供产品', isTitle: true },
                        {
                            msg: '根据您的房屋情况，我推荐您可以购买**服务哦',
                            isTitle: false,
                        },
                        {
                            msg:
                                '目前**服务活动价只需要**元，建议您尽快抢购，不要错过活动哦~',
                            isTitle: false,
                        },
                        {
                            msg:
                                '近期活动力度比较大，为了避免您错过活动，建议您可以先购买，我这边帮您保留订单，后期您确定了时间再次联系我们直接帮您安排师傅就可以了 ',
                            isTitle: false,
                        },
                        { msg: '促成下单', isTitle: true },
                        {
                            msg:
                                '目前您可以体验一下新人优惠，感受一下我们的专业服务',
                            isTitle: false,
                        },
                        {
                            msg:
                                '如果您之前已经享受过新人优惠也可以更换手机号下单奥',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您放心，我们的工匠师傅都是经过专业培训的，每一位师傅都是拥有同样的服务标准/协商其他时间',
                            isTitle: false,
                        },
                        {
                            msg:
                                '因为目前师傅的时间实时更新，为了避免时间被其他用户预约了，建议您还是可以提前1-3天预约哦',
                            isTitle: false,
                        },
                        {
                            msg:
                                '因为师傅的时间实时更新，为了避免师傅的时间被其他用户预约了，您看现在方便我帮您预约可以吗？',
                            isTitle: false,
                        },
                        {
                            msg:
                                '近期活动力度比较大，为了避免您错过活动，建议您可以先购买，我这边帮您保留订单，后期您确定了时间再次联系我们直接帮您安排师傅就可以了',
                            isTitle: false,
                        },
                        {
                            msg:
                                '那建议您可以先购买（除接入订单），我这边帮您保留订单，后期您确定了时间再次联系我们直接帮您安排师傅就可以了',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '订单处理',
                    children: [
                        { msg: '修改订单', isTitle: true },
                        {
                            msg:
                                '请您提供预约服务的手机号码，帮您查询一下订单。',
                            isTitle: false,
                        },
                        {
                            msg:
                                '请您提供一下修改后的服务地址，客服帮您修改订单',
                            isTitle: false,
                        },
                        {
                            msg: '请问您是想指定哪位师傅服务？客服帮您修改',
                            isTitle: false,
                        },
                        {
                            msg:
                                '查询到您的订单可以帮您修改到***，您看可以吗，如果可以，客服马上帮您操作修改奥',
                            isTitle: false,
                        },
                        {
                            msg:
                                '如您需要增加服务时长，可以现场扫描师傅的二维码进行补单就可以啦。',
                            isTitle: false,
                        },
                        { msg: '取消订单', isTitle: true },
                        {
                            msg:
                                '请您提供预约服务的手机号码，帮您查询一下订单。',
                            isTitle: false,
                        },
                        {
                            msg:
                                '查询到您是自己在平台下单的，客服没有权限无法帮您操作取消订单，如您确认取消订单，客服帮您取消师傅的安排，您的订单退款需要您在****申请退款。',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您的订单已为您备注取消订单，不会为您安排师傅上门服务了，由于客服无法为您退款，辛苦您记得联系下单平台申请退款',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您的订单已为您操作取消，不会为您安排师傅上门服务了，请您联系您的下单平台申请退款即可',
                            isTitle: false,
                        },
                        { msg: '您可以在我的订单中申请退款', isTitle: false },
                        {
                            msg:
                                '我司平台的标准化服务，定价合理透明，服务流程规范，整体性价比远高于市面上的其他产品。若之前有带给过您不好的体验，我们将竭力提升服务品质，希望您考虑一下，继续使用。',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '异议处理',
                    children: [
                        { msg: '价格原因', isTitle: true },
                        {
                            msg:
                                '目前您可以体验一下新人优惠，感受一下我们的专业服务',
                            isTitle: false,
                        },
                        {
                            msg:
                                '如果您之前已经享受过也可以更换手机号或换（美团）渠道下单',
                            isTitle: false,
                        },
                        { msg: '指定工匠原因', isTitle: true },
                        {
                            msg:
                                '您放心，我们的工匠师傅都是经过专业培训的，每一位师傅都是拥有同样的服务标准/协商其他时间',
                            isTitle: false,
                        },
                        { msg: '时间原因', isTitle: true },
                        {
                            msg:
                                '因为目前师傅的时间实时更新，为了避免时间被其他用户预约了，建议您还是可以提前1-3天预约哦',
                            isTitle: false,
                        },
                        {
                            msg:
                                '那建议您可以先购买（除接入订单），我这边帮您保留订单，后期您确定了时间再次联系我们直接帮您安排师傅就可以了',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '保洁类话述',
                    children: [
                        { msg: '日常保洁', isTitle: true },
                        {
                            msg:
                                '您好，日常保洁着重房屋的表面清洁打扫，如家具、家电表面的清洁，地面清洁，墙面简单除尘以及玻璃内侧清洁',
                            isTitle: false,
                        },
                        { msg: '深度保洁', isTitle: true },
                        {
                            msg:
                                '您好，深度保洁更适合长时间未彻底打扫的房屋，或者家里厨房有重油污、卫生间有重水垢、需要擦玻璃等情况，使用专业设备对厨房洗菜池、卫生间马桶、浴缸、洗脸池进行高温消毒，强力杀菌。柜顶除尘，关注安全健康',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您好，深度保洁包括家庭室内表面清洁，擦玻璃内外侧，包含纱窗清洗，窗槽。清除厨房重油污，卫生间重水垢，橱柜柜子内部清理，使用专业设备对厨房洗菜池、卫生间马桶、浴缸、洗脸池进行高温消毒，强力杀菌。柜顶除尘，关注安全健康',
                            isTitle: false,
                        },
                        {
                            msg:
                                '1、深度保洁针对长时间未打扫、有人居住的全屋场景，主要以更深层次的保洁服务为主。\n2、长时间无人居住-定义为深度保洁。\n3、家里饲养宠物"',
                            isTitle: false,
                        },
                        { msg: '优选保洁', isTitle: true },
                        {
                            msg:
                                '您好，优选保洁是为有高品质生活追求的用户打造的高端保洁服务，采用自营金牌保洁师服务，技能更全面，使用专业设备对厨房洗菜池、卫生间马桶、浴缸、洗脸池进行高温消毒，强力杀菌。柜顶、窗帘除尘，关注安全健康，更多人性化服务，体验更优。',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您好，优选保洁包括家庭室内表面清洁，窗帘、柜顶除尘、使用专业设备对厨房洗菜池、卫生间马桶、浴缸、洗脸池进行高温消毒，使用分区毛巾和一次性马桶湿巾，关注安全健康，床铺整理、收纳小物件，洗碗，液晶数码产品的擦拭，更加人性化，体验更优，金牌自营保洁师，技能更全面。玻璃内侧清洁。有手持吸尘器。不含洗衣服。',
                            isTitle: false,
                        },
                        {
                            msg: '日常保洁和优选保洁区别',
                            isTitle: true,
                        },
                        {
                            msg:
                                '日常保洁着重房屋的表面清洁打扫，优选保洁是为有高品质生活追求的用户打造的高端保洁服务，采用自营金牌保洁师服务，技能更全面，使用专业设备进行高温消毒，强力杀菌。柜顶、窗帘除尘，关注安全健康，更多人性化服务，体验更优',
                            isTitle: false,
                        },
                        {
                            msg: '日常保洁和深度保洁区别',
                            isTitle: true,
                        },
                        {
                            msg:
                                '日常保洁着重房屋的表面清洁打扫，深度保洁更适合长时间未彻底打扫的房屋，或者家里有厨房有重油污、卫生间有重水垢、需要擦玻璃等情况，使用专业设备进行高温消毒，强力杀菌。柜顶除尘，关注安全健康',
                            isTitle: false,
                        },
                        { msg: '高温保洁', isTitle: true },
                        {
                            msg:
                                '您好，高温保洁主要包括全屋地面整体清洁、全屋家具表面擦拭（不含柜顶)、全屋电器表面擦拭、全屋台面物品有序整理、卫浴清洁、使用专业设备对厨房洗菜池、卫生间马桶、浴缸、洗脸池进行高温消毒、床品除螨、紫外线灯对卧室杀菌消毒',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您好，高温保洁使用制剂：庄臣品牌系列的快活清洁消毒液，使用工具：德国进口凯驰高温蒸汽机，紫外线消毒灯',
                            isTitle: false,
                        },
                        {
                            msg:
                                '您好，高温蒸汽机使用范围是对厨房、卫生间 水池、水龙头、下水口、马桶、浴缸进行高温蒸汽消毒。',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '家电清洗',
                    children: [
                        {
                            msg: '油烟机清洗服务流程（半拆）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '验机→断开电源→做好现场防污染保护→摘下油盒→摘下滤网→拆下部件放入清洗液中浸泡→在涡轮仓内部喷洒除重油清洗剂→用清洗机高温蒸汽功能清洗内部油污→刷洗拆下部件→装回拆下部件→擦拭油烟机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        {
                            msg: '油烟机清洗服务流程（全拆）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '验机→断开电源→做好现场防污染保护→摘下油盒→摘下滤网→拆下整机→拆下部件放入清洗液中浸泡→在涡轮仓内部喷洒除重油清洗剂→做好电子部件及电机的防护→用清洗机高温蒸汽功能清洗内部油污→刷洗拆下部件→装回拆下部件→擦拭油烟机外壳表面及电源线→装回整机→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        { msg: '油烟机验收标准', isTitle: true },
                        {
                            msg:
                                '"部件安装无缝隙，清洗部位无油渍，无积水，无尘，无絮状物，设备功能正常，不漏油，排烟正常，卫生干净、整洁，功能正常，客户满意。',
                            isTitle: false,
                        },
                        {
                            msg: '油烟机清洗分为半拆、全拆两种清洗服务"',
                            isTitle: false,
                        },
                        { msg: '油烟机服务内容', isTitle: true },
                        {
                            msg:
                                '您好，油烟机服务内容主要为：集油盒、滤油网、涡轮、涡壳、外表面',
                            isTitle: false,
                        },
                        {
                            msg: '空调清洗服务流程（挂机）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '挂式机服务流程：验机→断开电源→做好现场防污染保护→打开上盖→摘下滤网→摘下导风板→套上空调专用清洗罩→往鳍片表面喷抹清洁剂件→清洗机高温蒸汽功能清洗鳍片件→用清洗机高压水柱冲洗贯流风机缝隙→刷洗拆下部件→装回拆下部件→擦拭内机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        {
                            msg: '空调清洗服务流程（柜机）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '柜式机服务流程：验机→断开电源→做好现场防污染保护→打开进风格栅→保护好控制电路→往鳍片表面喷抹清洁剂件→清洗机高温蒸汽功能清洗鳍片件→用清洗机高压水柱冲洗离心风机叶轮→拆下散热挡板→刷洗拆下部件→装回拆下部件→擦拭柜机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        { msg: '空调验收标准', isTitle: true },
                        {
                            msg:
                                '部件安装无缝隙，清洗部位无油渍，无积水，无尘，无絮状物，设备功能正常，无振动，不漏水，卫生干净、整洁，功能正常，客户满意。',
                            isTitle: false,
                        },
                        { msg: '空调服务内容', isTitle: true },
                        {
                            msg:
                                '您好，空调服务内容主要为：滤网、风轮、蒸发器、百叶、外表面',
                            isTitle: false,
                        },
                        {
                            msg: '洗衣机清洗服务流程（波轮半拆）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '波轮洗衣机清洗流程：验机→断开电源→做好现场防污染保护→洗衣机进水→加入适量洗衣机专用清洗剂→正常程序洗涤→拆除上盖四周螺丝→摘下上盖→拆除平衡圈→用波轮洗衣机专用毛刷刷洗内外桶缝隙→清洗机高温蒸汽功能清洗内桶→装上平衡圈→装上上盖→进水正常洗涤→高温消毒→擦拭洗衣机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        {
                            msg: '洗衣机清洗服务流程（波轮全拆）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '验机→做好现场防污染保护→洗衣机进水→加入适量洗衣机专用清洗剂→正常程序洗涤→断开电源→拆除上盖四周螺丝→摘下上盖→拆除平衡圈→拆除波轮盘，取出内桶→用波轮洗衣机专用毛刷刷洗内外桶缝隙→清洗机高温蒸汽功能清洗内桶→装回内桶→装上平衡圈→装上上盖→进水正常洗涤→高温消毒→擦拭洗衣机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        {
                            msg: '洗衣机清洗服务流程（滚筒半拆）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '滚筒洗衣机清洗流程：验机→断开电源→做好现场防污染保护→洗衣机进水→加入适量洗衣机专用清洗剂→正常程序洗涤→摘下洗涤剂盒→用清洗机高温蒸汽功能清洗内桶→用滚筒洗衣机专用毛刷刷洗内外桶缝隙→加水正常洗涤→装回洗涤剂盒→高温消毒→擦拭洗衣机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        {
                            msg: '洗衣机清洗服务流程（滚筒全拆）',
                            isTitle: true,
                        },
                        {
                            msg:
                                '验机→做好现场防污染保护→洗衣机进水→加入适量洗衣机专用清洗剂→正常程序洗涤→断开电源→摘下洗涤剂盒→依次拆卸洗衣机并取出内外桶→用清洗机高温蒸汽功能清洗内外桶→用滚筒洗衣机专用毛刷刷洗内外桶缝隙→组装机器→装回洗涤剂盒→高温消毒→擦拭洗衣机外壳表面及电源线→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        { msg: '洗衣机验收标准', isTitle: true },
                        {
                            msg:
                                '部件安装无缝隙，清洗部位无油渍，无积水，无尘，无絮状物，设备功能正常，无振动，不漏水，卫生干净、整洁，功能正常，客户满意。',
                            isTitle: false,
                        },
                        { msg: '洗衣机服务内容', isTitle: true },
                        {
                            msg:
                                '您好，洗衣机服务内容主要为：洗衣机机盖、桶内壁、洗涤盒、滤网、硅胶圈、机槽、外表面、服务区域地板等',
                            isTitle: false,
                        },
                        { msg: '冰箱清洗服务流程', isTitle: true },
                        {
                            msg:
                                '服务流程：验机→断开电源→做好现场防污染保护→取出冰箱内物品→取出隔板→用毛巾蘸清洗剂擦洗冰箱内部→用清洗机高温蒸汽功能清洗冰箱内部→清洗门封条及缝隙→刷洗隔板并装回→擦洗冰箱外表面及电源线→用清洗机臭氧消毒功能消毒→接通电源→邀请客户共同试机→试机正常→客户满意→打扫卫生，整理工具。',
                            isTitle: false,
                        },
                        { msg: '冰箱清洗验收标准', isTitle: true },
                        {
                            msg:
                                '部件安装无缝隙，清洗部位无油渍，无积水，无尘，无絮状物，设备功能正常，无振动，无堵塞，无异味，卫生干净、整洁，功能正常，客户满意。',
                            isTitle: false,
                        },
                        { msg: '冰箱清洗服务内容', isTitle: true },
                        {
                            msg:
                                '您好，冰箱清洗服务内容：保鲜层、冷藏层、冷冻层、门沿/门内壁、密封条、隔层架、外表面、服务区域地板。',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '开荒、保姆服务',
                    children: [
                        { msg: '开荒怎么收费', isTitle: true },
                        {
                            msg:
                                '您好，新居开荒（无家具）14元/平米，新居开荒（有家具）16元/平米，均50平米起，需要您注意：建议参考房本面积下单，如果是loft或者复式结构等实际面积超出建筑面积的按照实际面积核算，不可拆分，需要整屋清洁',
                            isTitle: false,
                        },
                        {
                            msg: '新居开荒（无家具）/适用场景',
                            isTitle: true,
                        },
                        {
                            msg:
                                '您好，新居开荒无家具服务，主要是针对房屋装修完成后的首次保洁业务，主要以去渍、清洁、除尘除胶等服务为主，不包括含家电、家具内外清洁。',
                            isTitle: false,
                        },
                        {
                            msg: '新居开荒（有家具）/适用场景',
                            isTitle: true,
                        },
                        {
                            msg:
                                '您好，有家具开荒适用于已完成全屋装修，或老房已完成局部装修，搬入家具，家电，需要全屋除油渍，除尘，除胶、除油漆，全屋窗户玻璃内外部的清洁',
                            isTitle: false,
                        },
                        { msg: '不清楚平米', isTitle: true },
                        {
                            msg:
                                '您好，我们新居开荒50平米气候，按照房本面积下单，如果是loft或者复式结构等实际面积超出建筑面积的按照实际面积核算，不可拆分，需要整屋清洁，建议您看下具体的面积下单，超过50平米的部分可以进行多退少补',
                            isTitle: false,
                        },
                        { msg: '做饭保姆服务内容', isTitle: true },
                        {
                            msg:
                                '做饭保姆是以做饭为主，简单保洁整理、洗碗为辅的做饭服务，4小时服务可按需求做1-2顿饭，8小时服务可按需求做2-3顿饭',
                            isTitle: false,
                        },
                        { msg: '是否包含育婴服务', isTitle: true },
                        {
                            msg:
                                '非常抱歉目前做饭保姆只做标准服务内容，家里如果有0-3岁小婴儿可以在完成保姆服务工作后短暂辅助替换家长，仍需家中留家长主带婴儿，育儿保姆和育儿师会在下一阶段产品中上线',
                            isTitle: false,
                        },
                        {
                            msg: '是否包含照顾老人服务',
                            isTitle: true,
                        },
                        {
                            msg:
                                '非常抱歉目前做饭保姆只做标准服务内容，不包含照料非自理老人，白班保姆极限为老人陪伴和散步，家里如果非自理老人，需家中留子女主照料，养老类保姆会在下一阶段产品中上线',
                            isTitle: false,
                        },
                        {
                            msg: '我们的产品跟市面上的保姆有哪些区别？',
                            isTitle: true,
                        },
                        {
                            msg:
                                '我们的运营模式为非中介保姆，不收取中介费，对每一名保姆在上岗前做统一的标准的身份认证、健康认证、培训和考试，确保保姆的安全性和服务内容标准；订单方面我们采用按次购买、按需服务的方式，降低用户的用人成本，增加保姆的订单收入',
                            isTitle: false,
                        },
                    ],
                },
                {
                    mag: '疑难问题话术',
                    children: [
                        { msg: '打扫不干净', isTitle: true },
                        {
                            msg:
                                '您好，非常抱歉给您带来不了不好的体验，麻烦您把打扫的不干净的图片发送至在线客服。收到您的反馈后我们会在24小时内联系您处理。',
                            isTitle: false,
                        },
                        { msg: '如何保证服务效果', isTitle: true },
                        {
                            msg:
                                '我们的工匠都是经过公司专业培训过的，服务质量您可以放心，服务结束后也会邀请您验收，如果有问题您可和工匠师傅随时沟通，有其他问题也可以及时来电反馈',
                            isTitle: false,
                        },
                        { msg: '物品损坏', isTitle: true },
                        {
                            msg:
                                '您好，非常抱歉给您带来不了不好的体验，麻烦您把物品损坏的图片发送至在线客服。收到您的反馈后我们会在24小时内联系您处理。',
                            isTitle: false,
                        },
                        { msg: '物品丢失', isTitle: true },
                        {
                            msg:
                                '您好，我们的工匠都是经过专业培训后上岗，不会出现这种情况的，您的问题我已记录反馈，我们会积极协助您处理。',
                            isTitle: false,
                        },
                        { msg: '保洁工匠准备', isTitle: true },
                        {
                            msg:
                                '您好，工匠师傅上门服务时，会携带相关工具，不需要您准备',
                            isTitle: false,
                        },
                        { msg: '指定师傅', isTitle: true },
                        {
                            msg:
                                '您好，如果您预约的服务时间段工匠师傅空闲并在您的服务地址内，可以为您指定的',
                            isTitle: false,
                        },
                        { msg: '需要年轻的师傅', isTitle: true },
                        {
                            msg:
                                '您好，我们的师傅都是经过公司专业培训过的，年龄在20-45岁之间，服务标准都是一致的，您可以放心',
                            isTitle: false,
                        },
                        { msg: '询问工匠电话', isTitle: true },
                        {
                            msg:
                                '师傅的联系方式您可以在大众工匠微信小程序，我的-全部订单-进行中进行查看，或者您提供下您的下单手机号码，我马上通知师傅和您取得联系',
                            isTitle: false,
                        },
                        { msg: '应聘工匠', isTitle: true },
                        {
                            msg:
                                '您好，请问您是否有保洁经验呢？麻烦您提供一下您的姓名、年龄、联系方式、现居住地址，帮您记录反馈，稍后会有专人与您联系，请您保持电话畅通。',
                            isTitle: false,
                        },
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
            console.log(arguments);
            this.hideUp();
            this.itemList = mag;
            mag.active = true;
        },
        hideUp() {
            this.itemList.active = false;
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
    *::-webkit-scrollbar {
        width: 0 !important;
        height: 0 !important;
    }
    body {
        font-family: 'Source Sans Pro', sans-serif;
    }

    #wrapper {
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
        -ms-overflow-style: none;
    }
    main::-webkit-scrollbar {
        width: 0 !important;
    }
    .row {
        background-color: #8080ff;
        -webkit-user-select: none;
        -webkit-app-region: drag;
        /* border: 1px solid #FFFFFF; */
        max-height: 500px;
        overflow: scroll;
    }

    .mag {
        /* display: inline-block; */
        -webkit-app-region: no-drag;
        color: white;
        font-size: 14px;
        line-height: 16px;
        padding: 4px 5px;
        background-color: #8080ff;
        border-right: 2px solid #ffffff;
        cursor: pointer;
        float: left;
        font-family: 'Yahe', 'Times New Roman', Times, serif;
    }
    .mag:hover {
        background-color: #ffffff;
        color: #8080ff;
    }
    .mag.close {
        float: right;
        border: none;
    }
    .mag[active='true'] {
        background-color: #ffffff;
        color: #8080ff;
    }
</style>
