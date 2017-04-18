<template lang="html">
    <div class="print-only" v-if="$parent.$parent.sharedState.selected.address">
        <h2>GeoPortal <span style="text-transform:capitalize;">{{ $parent.$parent.sharedState.show }}</span> Report</h2>
        <h4><a v-bind:href="getHref()">{{ $parent.$parent.sharedState.selected.address }}</a></h4>
    </div>
</template>

<script>
export default {
    name: 'printheader',
    methods: {
        getHref: function() {
            return window.location.href;
        }
    }
}
</script>
