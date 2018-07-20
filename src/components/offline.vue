<template>
    <div v-show="!online" class="row gutter no-print">
      <div class="column card offline">
        <h3>You are currently offline!</h3>
        <p>GeoPortal will begin working again when you reconnect to the Internet.</p>
      </div>
    </div>
</template>

<script>

export default {
  name: 'offline',
  data: function() {
    return {
      online: true
    };
  },
  mounted: function() {
    let _this = this;
    if ('onLine' in navigator) {
      if (navigator.onLine === false) {
        _this.online = false;
      }
      window.addEventListener('online', _this.onLine);
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
};
</script>