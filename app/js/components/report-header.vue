<template lang="html">
    <div class="selected-location" v-if="sharedState.show !== 'welcome'">
        <h4 class="print-only">GeoPortal<br>Mecklenburg County GIS</h4>
        <span v-if="sharedState.selected.address"><i class="icon icon-place"></i> {{ sharedState.selected.address }}</span>
    </div>
</template>

<script>
    export default {
        name: 'selected-location'
    }
</script>

<style lang="css" scoped>
    .selected-location {
        font-size: 1.2em;
        margin-bottom: 30px;
        text-align: center;
    }
    i {
        color: rgb(0, 145, 234);
    }
</style>
