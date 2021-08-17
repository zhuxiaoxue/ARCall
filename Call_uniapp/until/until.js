import store from '../store/index.js';
import permision from "../js_sdk/wa-permission/permission.js";
import RTCcode from "./rtccode.js";
const Store = {
	// 是否正在通话中
	isCalling: false,
	// 判断 多人呼叫
	conference: false,
	// 提示框定时器记录
	popupTimer: null,

}
// 全局工具封装
const Utils = {
	// 平台分类查询权限
	async equipment() {
		// 查看权限
		if (uni.getSystemInfoSync().platform == 'ios') {
			//查看相机权限
			let oa = await Utils.requestAndroidPermission("camera", 'ios', '相机');
			//查看录音权限
			let ob = await Utils.requestAndroidPermission("record", 'ios', '录音');
			await Utils.hintInfo([oa, ob])

		} else if (uni.getSystemInfoSync().platform === 'android') {
			//查看相机权限
			let oa = await Utils.requestAndroidPermission("android.permission.CAMERA", 'android', '相机');
			//查看录音权限
			let ob = await Utils.requestAndroidPermission("android.permission.RECORD_AUDIO", 'android', '录音');
			await Utils.hintInfo([oa, ob])
		}
	},
	// 查询权限封装
	async requestAndroidPermission(permisionID, type, libe) {
		let result = 0;
		let strStatus = "";
		type == 'ios' ? result = await permision.judgeIosPermission(permisionID) : result = await permision
			.requestAndroidPermission(
				permisionID);
		if (result == 1) {
			strStatus = "已获得授权,可正常使用"
		} else if (result == 0) {
			strStatus = "未获得授权,无法使用"
		} else {
			strStatus = "被永久拒绝权限,无法使用"
		};
		return libe + strStatus
	},
	// 获取元素
	getEl(el) {
		if (typeof el === 'string' || typeof el === 'number') return el;
		if (WXEnvironment) {
			return el.ref;
		} else {
			return el instanceof HTMLElement ? el : el.$el;
		}
	},
	// 生成uid
	generateNumber(len) {
		let numLen = len || 8;
		let generateNum = Math.ceil(Math.random() * Math.pow(10, numLen));
		return generateNum < Math.pow(10, numLen - 1) ?
			Utils.generateNumber(numLen) :
			generateNum;
	},
	// 全局vue提示信息 type: success warn error info
	hintInfo(message, type = 'info', duration = 3000) {
		const oSubId = store.state.popubId || 'poPup';
		// // 通过 id 获取 nvue 子窗体
		const subNVue = uni.getSubNVueById(oSubId);
		if (subNVue) {
			// 打开 nvue 子窗体
			subNVue.show('fade-in', 300);
			uni.$emit('paltfrom-popup', {
				type,
				message
			});
			// 关闭 nvue 子窗体
			Store.popupTimer && clearTimeout(Store.popupTimer);
			Store.popupTimer = setTimeout(() => {
				subNVue.hide('fade-out', 300);
				uni.$emit('paltfrom-popup', {
					type: '',
					message: ''
				});
			}, duration)
		}
	},
	// RTC 提示信息(nvue) type: success warn error info
	hintRTCInfo(message, type = 'info', duration = 3000) {
		// // 通过 id 获取 nvue 子窗体
		const subNVue = uni.getSubNVueById('poPup-rtm');
		// console.log(subNVue);
		// 打开 nvue 子窗体  
		subNVue.show('fade-in', 300);
		uni.$emit('paltfrom-popup', {
			type,
			message
		});
		// 关闭 nvue 子窗体  
		Store.popupTimer && clearTimeout(Store.popupTimer);
		Store.popupTimer = setTimeout(() => {
			subNVue.hide('fade-out', 300);
		}, duration)
	},
	// 还原(vue)
	restoreAll() {
		// 通话结束
		uni.$emit('isCalling', false);
	},
	// 呼叫邀请页面(vue) path 
	callInvitationPage(path = 'index', info = '', hint = '') {
		const oInfo = info ? JSON.stringify(info) : '';
		uni.redirectTo({
			url: path + (oInfo ? '?info=' + oInfo : ''),
			success(res) {
				console.log('成功', res);
				// 提示
				if (hint) {
					setTimeout(() => {
						Utils.hintInfo(hint.message, hint.type);
					}, 200);
				}
			},
			fail(res) {
				console.log("失败", res);
			},
		});
	},
	// 视频通话页面(nvue)
	callVideoPage(path, info = '') {
		const subNVue = uni.getSubNVueById('CavasViewRTC');
		// 显示
		if (path === 'rtc') {
			uni.$emit('CavasViewRtc', info);
			subNVue.show('fade-in', 300);
		} else {
			uni.$emit('CavasViewRtc', "");
			subNVue.hide('fade-out', 300);
		}
	}
}
// RTM 工具封装
const RTMUtils = {
	// 判断是否调用 login 成功
	useLogin: function(code, uid) {

		if (code == 0) {
			store.dispatch('upDataUId', uid);
			uni.showToast({
				title: '登录成功',
				icon: 'success',
				duration: 2000
			});
		} else {
			uni.showToast({
				title: '登录失败',
				icon: 'none',
				duration: 2000
			});
		}
	},
	// SDK 与 RTM 系统的连接状态发生改变
	ConnectionStateChanged: function(state, reason) {
		// 新连接状态 state
		let oState = ['', '初始状态。SDK 未连接到 RTM 系统', 'SDK 正在登录 AR RTM 系统', 'SDK 已登录 RTM 系统',
			'SDK 与 RTM 系统连接由于网络原因出现中断，SDK 正在尝试自动重连 RTM 系统', 'SDK 停止登录 RTM 系统'
		];
		// 连接状态改变原因 reason
		let oReason = ['', 'SDK 正在登录 RTM 系统', 'SDK 登录 RTM 系统成功', 'SDK 登录 RTM 系统失败',
			'SDK 无法登录 AR RTM 系统超过 6 秒，停止登录', 'SDK 与 RTM 系统的连接被中断', '用户已调用 logout() 方法登出 RTM 系统',
			'SDK 被服务器禁止登录 RTM 系统', '另一个用户正以相同的用户 ID 登陆 RTM 系统',
		];
		// 消息提醒
		Utils.hintInfo(['连接状态：' + oState[state], '改变原因：' + oReason[reason]]);
	},
	// 收到点对点消息回调
	PeerMessageReceived: function(message, peerId) {
		console.log("收到点对点消息回调", message, peerId);
		const oInfo = JSON.parse(message);
		// RTC 视频通话转语音通话
		if (oInfo.Cmd == "SwitchAudio") {
			console.log("RTC 视频通话转语音通话");
			uni.$emit("rtc-SwitchAudio", {
				message: "SwitchAudio",
				peerId: peerId
			})
			// RTC 挂断
		} else if (oInfo.Cmd == "EndCall") {
			uni.$emit("rtc-endcall", {
				message: "EndCall",
				peerId: peerId
			});

		}
	},
	// 返回给主叫：被叫已接受呼叫邀请
	LocalInvitationAccepted: async function(data) {
		console.log('返回给主叫：被叫已接受呼叫邀请', data);
		// 正在通话
		uni.$emit('isCalling', true);
		// 数据组装
		const oRes = data.response ? JSON.parse(data.response) : {};
		const oData = await Object.assign({}, JSON.parse(data.content), oRes);
		// 进入 rtc 视频通话
		await Utils.callVideoPage('rtc', {
			calleeId: data.calleeId,
			content: JSON.stringify(oData),
		})
	},
	// 返回给主叫：呼叫邀请已被取消
	LocalInvitationCanceled: async function(data) {
		console.log('呼叫邀请已取消', data);
		// 还原
		await Utils.restoreAll();
		// 关闭呼叫邀请回退到首页
		await Utils.callInvitationPage('index', '', {
			message: '呼叫邀请已取消(主动挂断或对方已离线)',
			type: 'success'
		});
	},
	// 返回给主叫：呼叫邀请进程失败
	LocalInvitationFailure: async function(data) {
		console.log('呼叫邀请进程失败', data);
		// 还原
		await Utils.restoreAll();
		// 关闭呼叫邀请回退到首页
		await Utils.callInvitationPage('index', '', {
			message: '呼叫邀请进程失败',
			type: 'error'
		});
	},
	// 返回给主叫：被叫已收到呼叫邀请
	LocalInvitationReceivedByPeer: function(data) {
		if (data.state == 2) {
			console.log('被叫已收到呼叫邀请', data);
			// 正在通话
			const oCont = JSON.parse(data.content)
			// 进入呼叫邀请
			Utils.callInvitationPage('rtmPage', {
				mode: oCont.Mode === 0 ? '视频' : '语音',
				type: '主叫',
				uid: data.calleeId,
			})
			uni.$emit('isCalling', true);
		}
	},
	// 返回给主叫：被叫已拒绝呼叫邀请
	LocalInvitationRefused: async function(data) {
		console.log('被叫已拒绝呼叫邀请', data);
		// 还原
		await Utils.restoreAll();
		if (data.response) {
			const oDa = JSON.parse(data.response);
			if (oDa.Reason == 'calling' || oDa.Cmd == 'Calling') {
				// 关闭呼叫邀请
				await Utils.callInvitationPage('index', '', {
					message: '被叫正在通话中',
					type: 'warn'
				});
			} else {
				// 关闭呼叫邀请
				await Utils.callInvitationPage('index', '', {
					message: '被叫已拒绝呼叫邀请',
					type: 'warn'
				});
			}
		} else {
			// 关闭呼叫邀请
			await Utils.callInvitationPage('index', '', {
				message: '被叫已拒绝呼叫邀请',
				type: 'warn'
			});
		}
	},

	// 返回给被叫：接受呼叫邀请成功
	RemoteInvitationAccepted: function(data) {
		console.log('返回给被叫：接受呼叫邀请成功', data);
		// 正在通话
		uni.$emit('isCalling', true);
		// 数据组装
		const oRes = data.response ? JSON.parse(data.response) : {};
		const oData = Object.assign({}, JSON.parse(data.content), oRes);
		// 进入 rtc 视频通话
		Utils.callVideoPage('rtc', {
			calleeId: data.callerId,
			content: JSON.stringify(oData),
		})
	},
	// 返回给被叫：主叫已取消呼叫邀请
	RemoteInvitationCanceled: async function(data) {
		console.log('主叫已取消呼叫邀请', data);
		// 还原
		await Utils.restoreAll();
		// 关闭呼叫邀请
		await Utils.callInvitationPage('index', '', {
			message: '主叫已取消呼叫邀请',
			type: 'warn'
		});
	},
	// 返回给被叫：来自主叫的呼叫邀请进程失败
	RemoteInvitationFailure: async function(data) {
		if (!Store.isCalling) {
			// 还原
			await Utils.restoreAll();
			// 关闭呼叫邀请回退到首页
			await Utils.callInvitationPage('index', '', {
				message: '主叫的呼叫邀请进程失败',
				type: 'error'
			});
		}
	},
	// 返回给被叫：收到一个呼叫邀请
	RemoteInvitationReceived: async function(data, refuse) {
		console.log('收到一个呼叫邀请', data);
		// 判断当前用户是否正在通话中
		if (Store.isCalling) {
			// console.log('前用户正在通话中');
			await refuse(data.callerId, {
				refuseId: data.callerId,
				Reason: "calling",
				Cmd: "Calling",
			})
		} else {
			// 主叫附带信息
			const oInfo = await JSON.parse(data.content);
			Store.conference = oInfo.Conference
			// uniapp 当前项目仅有 p2p 通话
			if (oInfo.Conference) {
				setTimeout(() => {
					// 多人通话(拒绝通话)
					refuse(data.callerId, {
						refuseId: data.callerId,
					});
				}, 1500)

			} else {
				// 正在通话
				uni.$emit('isCalling', true);
				await Utils.callInvitationPage('rtmPage', {
					mode: oInfo.Mode === 0 ? '视频' : '语音',
					type: '被叫',
					uid: data.callerId,
				});
			}
		}
	},
	// 返回给被叫：拒绝呼叫邀请成功
	RemoteInvitationRefused: async function(data) {
		console.log('拒绝呼叫邀请成功', data, Store.isCalling);
		if (!Store.isCalling) {
			console.log('拒绝呼叫邀请成功', data);
			// // 还原
			await Utils.restoreAll();
			// // 关闭呼叫邀请
			await Utils.callInvitationPage('index', '', {
				message: Store.conference ? '当前不支持多人呼叫，已拒绝' : '拒绝呼叫邀请成功',
				type: 'success'
			});
		}
	},
}
// RTC 工具封装
const RTCUtils = {
	// 发生警告
	Warning: function(code) {
		// 消息提醒
		Utils.hintRTCInfo(RTCcode.warning[Number(code)] || '未知警告', 'warn');
	},
	// 发生错误
	Error: function(code) {
		// 消息提醒
		Utils.hintRTCInfo(RTCcode.errore[Number(code)] || '未知错误', 'error');
	},
	// 网络连接状态已改变
	ConnectionStateChanged: function(res) {
		// 消息提醒
		Utils.hintRTCInfo(['当前网络连接状态：' + (RTCcode.connectionState.states[res.state] || '未知状态'), '络连接状态发生改变原因：' +
			(RTCcode.connectionState.reason[res.reason] || '未知原因')
		]);
	},
	// 远端视频变化
	RemoteVideoStateChanged: function(res) {
		// 消息提醒
		Utils.hintRTCInfo(['当前状态：' + (RTCcode.remoteVideoState.status[res.state] || '未知状态'), '原因：' + (RTCcode
			.remoteVideoState.reson[res.reason] || '未知原因')]);
	},
	// 挂断电话，返回首页
	destroyRtc: function() {
		// 还原
		Utils.restoreAll();
		// 返回首页
		uni.redirectTo({
			url: 'index?state=end',
			success(res) {
				console.log("成功", res);
			},
			fail(res) {
				console.log("失败", res);
			}
		});
	},
}

// 监测 是否正在通话
uni.$on("isCalling", (deta) => {
	Store.isCalling = deta;
});

export {
	Utils,
	RTMUtils,
	RTCUtils
}
