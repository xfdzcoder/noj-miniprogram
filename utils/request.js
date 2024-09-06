const defaultOptions = {
	timeout: 15000,
	dataType: 'json',
	header: {
		'content-type': 'application/json',
	}
};
const TOKEN_KEY = 'token';
const BASE_URL = 'http://localhost:7000/api/v2';

const ResponseCode = {
	OK: '20000',
	FAIL: '50000'
}
const LOADING_DELAY = 50; // 50ms 延迟
let loadingTimer;

const handleURL = (request) => {
	const {
		url
	} = request;
	if (!/https|http/.test(url)) {
		request.url = url.startsWith('/') ?
			`${BASE_URL}${url}` :
			`${BASE_URL}/${url}`;
	}
};

const whiteList = [
	'/user/auth/login'
]
const handleToken = (request) => {
	if (whiteList.includes(request.url)) {
		return
	}
	const token = uni.getStorageSync('user-info')?.token;
	console.log('token: ', token);
	if (token) {
		request.header['satoken'] = token;
	}
};

const showLoading = () => {
	uni.showLoading({
		title: '加载中',
	});
};

const hideLoading = () => {
	uni.hideLoading();
};

uni.addInterceptor('request', {
	invoke: function(config) {
		if (config.loading) {
			loadingTimer = setTimeout(showLoading, LOADING_DELAY);
		}
		handleURL(config)
		handleToken(config)
	},
	success(res) {
		const {
			data: resData
		} = res;
		const {
			code,
			message
		} = resData;
		if (code !== ResponseCode.OK) {
			// 处理其他错误代码
			return Promise.reject(resData);
		}
		return Promise.resolve(resData);
	},
	complete() {
		clearTimeout(loadingTimer);
		hideLoading();
	},
});

const wrapRequest = ({
	url = '',
	data = {},
	method = 'GET',
	header = {},
	loading = true,
} = {}) => {
	return uni.request({
		...defaultOptions,
		url,
		data,
		method,
		loading,
		header: {
			...defaultOptions.header,
			...header,
		},
	});
};

export default {
	get: (params) => wrapRequest({
		...params,
		method: 'GET'
	}),
	post: (params) => wrapRequest({
		...params,
		method: 'POST'
	}),
	put: (params) => wrapRequest({
		...params,
		method: 'PUT'
	}),
	del: (params) => wrapRequest({
		...params,
		method: 'DELETE'
	})
}