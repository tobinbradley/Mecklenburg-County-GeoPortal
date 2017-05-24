<template lang="html">
    <div v-show="!online" class="offline mdl-shadow--2dp mdl-cell mdl-cell--12-col no-print">
        <h3>You are currently offline!</h3>
        <p>GeoPortal will begin working again when you reconnect to the Internet.</p>
    </div>
</template>

<script>
    export default {
        name: 'offline',
        data: function() {
            return {
                online: true
            }
        },
        mounted: function() {
            let _this = this;
            if ('onLine' in navigator) {
                if (navigator.onLine === false) {
                    _this.online = false;
                }
                window.addEventListener('online',  _this.onLine);
                window.addEventListener('offline', _this.offLine);
            }
        },
        methods: {
            onLine: function() {
                this.online = true;
            },
            offLine: function() {
                this.online = false;
            }
        }
    }
</script>

<style lang="css" scoped>
    .offline {
        padding: 20px;
        color: #fff;
        background: #7B1FA2;
    }
    .offline h3 {
        margin: 0;
        font-size: 1.5em;
        font-weight: bold;
    }
    .offline p {
        margin-bottom: 0;
    }

</style>