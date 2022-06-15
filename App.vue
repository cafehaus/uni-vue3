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
</style>
<style src="./styles/iconfont.css" />
<style lang="stylus" src="./styles/main.styl" />
