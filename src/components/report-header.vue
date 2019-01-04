<template>
    <div class="selected-location text-center" v-if="sharedState.show !== 'welcome'">
        <h2 class="print-only">GeoPortal<br>Mecklenburg County GIS</h2>
        <h3 v-if="sharedState.selected.address">{{ sharedState.selected.address }}</h3>
    </div>
</template>

<script>
export default {
  name: "selected-location"
};
</script>
