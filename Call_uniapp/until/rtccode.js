// RTC 相关状态码
const code = {
	// 警告状态码
	warning: {
		8: "指定的 View 无效，使用视频功能时需要指定 view",
		16: "初始化视频功能失败。有可能是因视频资源被占用导致的。用户无法看到视频画面，但不影响语音通信",
		20: "请求处于待定状态。一般是由于某个模块还没准备好，请求被延迟处理",
		103: "没有可用的频道资源。可能是因为服务端没法分配频道资源",
		104: "查找频道超时。在加入频道时 SDK 先要查找指定的频道，出现该警告一般是因为网络太差，连接不到服务器",
		106: "打开频道超时。查找到指定频道后，SDK 接着打开该频道，超时一般是因为网络太差，连接不到服务器",
		107: "打开频道请求被服务器拒绝。服务器可能没有办法处理该请求或该请求是非法的",
		121: "TICKET 非法，打开频道失败",
		122: "尝试打开另一个服务器",
		701: "打开伴奏出错",
		1014: "音频设备模块：运行时播放设备出现警告",
		1016: "音频设备模块：运行时录音设备出现警告",
		1019: "音频设备模块：没有采集到有效的声音数据",
		1025: "音频播放或采集被系统事件（如来电）打扰",
		1033: "音频设备模块：录制设备被占用",
		1051: "音频设备模块：录音声音检查到啸叫",
	},
	// 错误状态码
	errore: {
		0: "没有错误",
		1: "一般性的错误（没有明确归类的错误原因）",
		2: "API 调用了无效的参数。例如指定的频道名含有非法字符",
		3: "SDK 初始化失败",
		4: "SDK 当前状态不支持此操作",
		5: "调用被拒绝",
		6: "传入的缓冲区大小不足以存放返回的数据",
		7: "SDK 尚未初始化，就调用其 API。请确认在调用 API 之前已创建 RtcEngine 对象并完成初始化",
		8: "指定的 View 无效，使用视频功能时需要指定 View",
		9: "没有操作权限。请检查用户是否授予 app 音视频设备使用权限",
		10: "API 调用超时。有些 API 调用需要 SDK 返回结果，如果 SDK 处理时间过长，超过 10 秒没有返回，会出现此错误",
		11: "请求被取消",
		12: "调用频率太高",
		13: "SDK 内部绑定到网络 Socket 失败",
		14: "网络不可用",
		15: "没有网络缓冲区可用",
		16: "初始化视频功能失败。有可能是因视频资源被占用导致的。用户无法看到视频画面，但不影响语音通信",
		17: "加入频道被拒绝",
		18: "离开频道失败",
		19: "资源已被占用，不能重复使用",
		101: "不是有效的 APP ID。请更换有效的 APP ID 重新加入频道",
		102: "不是有效的频道名。请更换有效的频道名重新加入频道",
		110: "开启了 token 校验但没有输入 token",
		111: "网络连接中断",
		112: "网络连接丢失",
		113: "在调用 sendStreamMessage 时，用户不在频道内",
		114: "在调用 sendStreamMessage 时，发送的数据长度大于 1024 个字节",
		115: "在调用 sendStreamMessage 时，发送的数据码率超过限制（6KB/s）",
		116: "在调用 createDataStream 时，创建的数据通道过多（超过 5 个通道）",
		120: "解密失败，可能是用户加入频道用了不同的密码。请检查加入频道时的设置，或尝试重新加入频道",
		123: "此用户被服务器禁止",
		125: "水印文件路径错误",
		134: "无效的 User account",
		1001: "加载媒体引擎失败",
		1002: "启动媒体引擎开始通话失败。请尝试重新进入频道",
		1004: "启动视频渲染模块失败",
		1005: "音频设备模块：音频设备出现错误（未明确指明为何种错误）。请检查音频设备是否被其他应用占用，或者尝试重新进入频道",
		1006: "音频设备模块：使用 java 资源出现错误",
		1007: "音频设备模块：设置的采样频率出现错误",
		1008: "音频设备模块：初始化播放设备出现错误。请检查播放设备是否被其他应用占用，或者尝试重新进入频道",
		1009: "音频设备模块：启动播放设备出现错误。请检查播放设备是否正常，或者尝试重新进入频道",
		1010: "音频设备模块：停止播放设备出现错误",
		1011: "音频设备模块：初始化录音设备时出现错误。请检查录音设备是否正常，或者尝试重新进入频道",
		1012: "音频设备模块：启动录音设备出现错误。请检查录音设备是否正常，或者尝试重新进入频道",
		1013: "音频设备模块：停止录音设备出现错误",
		1015: "音频设备模块：运行时播放出现错误。请检查录音设备是否正常，或者尝试重新进入频道",
		1017: "音频设备模块：运行时录音错误。请检查录音设备是否正常，或者尝试重新进入频道",
		1018: "音频设备模块：录音失败",
		1022: "音频设备模块：初始化 Loopback 设备错误",
		1023: "音频设备模块：启动 Loopback 设备错误",
		1030: "音频路由：连接蓝牙通话失败，默认路由会被启用",
		1359: "音频设备模块：无录制设备。请检查是否有可用的录放音设备或者录放音设备是否已经被其他应用占用",
		1501: "视频设备模块：没有摄像头使用权限。请检查是否已经打开摄像头权限",
		1600: "视频设备模块：未知错误",
		1601: "视频设备模块：视频编码器初始化错误。该错误为严重错误，请尝试重新加入频道",
		1602: "视频设备模块：视频编码器错误。该错误为严重错误，请尝试重新加入频道",
	},
	// 网络连接状态
	connectionState: {
		// 当前的网络连接状态
		states: {
			1: "网络连接断开",
			2: "建立网络连接中 ",
			3: "网络已连接",
			4: "重新建立网络连接中",
			5: "网络连接失败",
		},
		// 改变原因
		reason: {
			0: "建立网络连接中",
			1: "成功加入频道",
			2: "网络连接中断",
			3: "网络连接被服务器禁止",
			4: "加入频道失败",
			5: "离开频道",
			6: "不是有效的 APP ID。请更换有效的 APP ID 重新加入频道",
			7: "不是有效的频道名。请更换有效的频道名重新加入频道",
			8: "生成的 Token 无效。一般有以下原因：在控制台上启用了 App Certificate，但加入频道未使用 Token。当启用了 App Certificate，必须使用 Token在调用 joinChannel 加入频道时指定的 uid 与生成 Token 时传入的 uid 不一致",
			9: "当前使用的 Token 过期，不再有效，需要重新在你的服务端申请生成 Token",
			10: "此用户被服务器禁止",
			11: "由于设置了代理服务器，SDK 尝试重连",
			12: "更新 Token 引起网络连接状态改变",
			13: "客户端 IP 地址变更，可能是由于网络类型，或网络运营商的 IP 或端口发生改变引起",
			14: "SDK 和服务器连接保活超时，进入自动重连状态",
		}
	},
	remoteVideoState: {
		// 改变状态
		status: {
			0: '远端视频默认初始状态',
			1: '本地用户已接收远端视频首包',
			2: '远端视频流正在解码，正常播放',
			3: '远端视频流卡顿',
			4: '远端视频流播放失败'
		},
		// 原因
		reson: {
			0: '内部原因',
			1: '网络阻塞',
			2: '网络恢复正常',
			3: '本地用户停止接收远端视频流或本地用户禁用视频模块',
			4: '本地用户恢复接收远端视频流或本地用户启动视频模块',
			5: '远端用户停止发送视频流或远端用户禁用视频模块',
			6: '远端用户恢复发送视频流或远端用户启用视频模块',
			7: '远端用户离开频道',
			8: '远端视频流已回退为音频流',
			9: '回退的远端音频流恢复为视频流',
		}
	}
}

export default code;
