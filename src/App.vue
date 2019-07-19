<template>
  <div class="main-wrapper">
    <form class="main-form" novalidate>
      <step-one v-on:show-step-two="showStepTwo" :server-data="serverData"></step-one>
      <step-two v-show="visibilityStepTwo"></step-two>
    </form>
  </div>
</template>

<script>
import serverData from "@/assets/info.json";
import StepOne from "@/components/StepOne.vue";
import StepTwo from "@/components/StepTwo.vue";

export default {
  name: "app",
  data() {
	  return {
		 serverData: serverData, 
		 visibilityStepTwo: false
	  }
  },
  methods: {
	  showStepTwo() {
		  this.visibilityStepTwo = true;
	  }
  },
  components: {
    StepOne,
    StepTwo
  }
};
</script>

<style lang="scss">
@import "../node_modules/normalize.css/normalize.css";
@import url("https://fonts.googleapis.com/css?family=Ubuntu:300i,400,500,700&display=swap");
* {
  box-sizing: border-box;
  font-family: "Ubuntu", sans-serif;
}
.main-wrapper {
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
}
.main-form {
  width: 100%;
  max-width: 900px;
  background-color: #fff;
  padding: 0;
}
</style>
