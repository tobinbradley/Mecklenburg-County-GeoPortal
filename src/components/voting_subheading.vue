<template>
  <div>
    <div class="hr-sect" v-html="heading"></div>
  </div>
</template>

<script>
  export default {
    props: {
      heading: {
        type: String
      }
    }
  }
</script>

<style scoped>
.hr-sect {
	display: flex;
	flex-basis: 100%;
	align-items: center;
	color: rgba(0, 0, 0, 0.85);
	margin: 8px 0px;
  font-size: 1.3em;
}
.hr-sect::before,
.hr-sect::after {
	content: "";
	flex-grow: 1;
	background: rgba(0, 0, 0, 0.35);
	height: 1px;
	font-size: 0px;
	line-height: 0px;
	margin: 0px 8px;
}
</style>