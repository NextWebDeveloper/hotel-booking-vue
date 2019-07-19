<template>
	<div class="choice">
		<button 
		type="button" 
		class="choice__button" 
		:class="{ 'choice__button_nonactive' : value == limitMin }"
		@click="decrease">-</button>
		<span class="choice__value">{{ value }} </span>
		<button 
		type="button" 
		class="choice__button" 
		:class="classMaxNonactive"
		@click="increase">+</button>
	</div>
</template>

<script>
export default {
	name: 'PeopleChoice',
	data() {
		return {
			value: 0
		}
	},
	props: {
		limitMax: Number,
		limitMin: Number,
		freeChilds: Number
	},
	computed: {
		classMaxNonactive() {
			return {
				'choice__button_nonactive' : this.value === this.limitMax || this.freeChilds === 0
			}
		}
	},
	methods: {
		decrease() {
			if (this.value > this.limitMin) {
				this.value--
			}
			this.$emit('change-count', this.value)
		},
		increase() {
			if (this.freeChilds === 0) {
				return
			}
			if (this.limitMax) {
				if (this.value < this.limitMax) {
					this.value++
				}
			} else this.value++
			this.$emit('change-count', this.value)
		}
	},
	created() {
		this.value = this.limitMin
	}
}
</script>

<style lang="scss" scoped>
.choice {
	width: 110px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&__button {
		display: flex;
		width: 30px;
		height: 30px;
		align-items: center;
		justify-content: center;
		border: 1px solid rgb(90, 90, 230);
		outline: none;
		font-weight: 700;
		background-color: transparent;
		font-size: 20px;
		cursor: pointer;
		user-select: none;
		color: rgb(90, 90, 230);
		&_nonactive {
			cursor: default;
			color: #a3a3a3;
			border-color: #a3a3a3;
		}
	}
	&__value {
		font-size: 18px;
	}
}
</style>
