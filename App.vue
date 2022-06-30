<script>
    import { mapActions } from 'vuex'
	export default {
		onLaunch: function() {
			this.getAppInfo()
			this.getSystemInfo()
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapActions('app', ['getAppInfo', 'getSystemInfo'])
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "./styles/iconfont.css";
</style>
<style lang="stylus">
	@import "./styles/main.styl";
</style>
