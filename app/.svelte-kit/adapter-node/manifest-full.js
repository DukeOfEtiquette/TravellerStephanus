export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["robots.txt"]),
	mimeTypes: {".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.CHbvGa3x.js",app:"_app/immutable/entry/app.GE6rxG_6.js",imports:["_app/immutable/entry/start.CHbvGa3x.js","_app/immutable/chunks/CRptd-FP.js","_app/immutable/chunks/ByK39ISX.js","_app/immutable/entry/app.GE6rxG_6.js","_app/immutable/chunks/ByK39ISX.js","_app/immutable/chunks/DLyuN9IY.js","_app/immutable/chunks/CHOZcEJC.js","_app/immutable/chunks/1lgWkFZx.js","_app/immutable/chunks/BI_aeQ_c.js","_app/immutable/chunks/CnL8diQ7.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/character/[id]",
				pattern: /^\/character\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
