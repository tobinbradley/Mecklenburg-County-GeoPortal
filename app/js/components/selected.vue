<template lang="html">
    <div class="selected-location">
        <i class="icon icon-place"></i> <slot></slot>                
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
