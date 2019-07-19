<template>
  <div class="step-one-wrapper">
    <div class="step-one-inner">
      <div class="people-wrapper">
        <div @click="showPeopleChoice" class="people">
          <div class="people-block">
            <span class="people-block__value">{{ adults }}</span>
            {{ adultRus }}
          </div>
          <div class="people-block">
            <span class="people-block__value">{{ childs512 }}</span>
            {{ child512Rus }} 5-12 лет
          </div>
          <div class="people-block">
            <span class="people-block__value">{{ childs05 }}</span>
            {{ child05Rus }} до 5 лет
          </div>
        </div>
        <div v-show="hiddenBlocks.peopleChoice" class="people-choice-wrapper">
          <div class="people-choice">
            <span>Взрослых</span>
            <people-choice v-on:change-count="changeAdults" :limit-min="1"></people-choice>
          </div>
          <div class="people-choice">
            <span>Детей 5-12 лет</span>
            <people-choice
              v-on:change-count="changeChilds512"
              :limit-min="0"
              :limit-max="childLimit"
              :free-childs="freeChilds"
            ></people-choice>
          </div>
          <div class="people-choice">
            <span>Детей до 5 лет</span>
            <people-choice
              v-on:change-count="changeChilds05"
              :limit-min="0"
              :limit-max="childLimit"
              :free-childs="freeChilds"
            ></people-choice>
          </div>
        </div>
      </div>
      <div class="room-wrapper" :class="{ 'error-focus' : errors.roomType }">
        <div @click="showRoomChoice" class="room">
          <span v-if="!roomType">Выберите тип номера</span>
          <span v-else>{{ roomTypeRus }}</span>
        </div>
        <div v-show="hiddenBlocks.roomChoice" class="room-choice-wrapper">
          <label class="room-choice" @click="hideBlocks">
            <input type="radio" class="room-choice__input" value="econom" v-model="roomType" />
            <span class="room-choice__text">Эконом</span>
          </label>
          <label class="room-choice" @click="hideBlocks">
            <input type="radio" class="room-choice__input" value="standart" v-model="roomType" />
            <span class="room-choice__text">Стандарт</span>
          </label>
          <label class="room-choice" @click="hideBlocks">
            <input type="radio" class="room-choice__input" value="lux" v-model="roomType" />
            <span class="room-choice__text">Люкс</span>
          </label>
        </div>
      </div>
      <div class="dates-wrapper">
        <div
          @click="showDatepicker"
          class="date-wrapper date-wrapper_br"
          :class="{ 'error-focus' : errors.dateStart }"
        >
          <span class="date-wrapper__title">Заезд</span>
          <datepicker
            v-model="dates.dateStart"
            :language="dates.lang.ru"
            :disabled-dates="dates.disabledDatesStart"
            :input-class="'datepicker-input'"
            :wrapper-class="'datepicker-wrapper'"
            :calendar-class="'datepicker-calendar'"
            @selected="setDateStart"
            :monday-first="true"
          ></datepicker>
        </div>
        <div
          @click="showDatepicker"
          class="date-wrapper"
          :class="{ 'error-focus' : errors.dateEnd }"
        >
          <span class="date-wrapper__title">Выезд</span>
          <datepicker
            v-model="dates.dateEnd"
            :language="dates.lang.ru"
            :disabled-dates="dates.disabledDatesEnd"
            :input-class="'datepicker-input'"
            :wrapper-class="'datepicker-wrapper'"
            :calendar-class="'datepicker-calendar datepicker-calendar_end'"
            @selected="setDateEnd"
            :monday-first="true"
          ></datepicker>
        </div>
      </div>
    </div>
    <div class="step-one-errors">
      <p v-if="errors.roomType">Выберите тип комнаты</p>
      <p v-if="errors.dateStart">Введите дату заезда</p>
      <p v-if="errors.dateEnd">Введите дату отъезда</p>
    </div>
    <div class="step-one-button">
      <button type="button" @click="calculate">Рассчитать стоимость</button>
    </div>
    <div class="step-one-result" v-if="showTotalSum">
      <p>
        Стоимость отдыха {{ daysPeriod }} для {{totalPeople}}:
        <strong>{{totalSum}} руб.</strong>
      </p>
    </div>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { ru } from "vuejs-datepicker/dist/locale";
import PeopleChoice from "@/components/PeopleChoice.vue";

const getDaysArray = function(start, end) {
  let dt = new Date(start.getTime());
  let arr = [];
  for (; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt).setHours(0, 0, 0, 0));
  }
  return arr;
};

export default {
  data() {
    return {
      totalSum: 0,
      showTotalSum: false,
      adults: 1,
      childs512: 0,
      childs05: 0,

      roomType: null,

      errors: {
        roomType: false,
        dateStart: false,
        dateEnd: false
      },
      errorsCount: 0,

      dates: {
        dateStart: null,
        dateEnd: null,
        lang: {
          ru: ru
        },
        disabledDatesStart: {
          to: this.convertStrToDate(this.serverData.low.date_from),
          from: new Date(
            this.convertStrToDate(this.serverData.low2.date_to).setDate(
              this.convertStrToDate(this.serverData.low2.date_to).getDate() + 1
            )
          )
        },
        disabledDatesEnd: {
          to: this.convertStrToDate(this.serverData.low.date_from),
          from: new Date(
            this.convertStrToDate(this.serverData.low2.date_to).setDate(
              this.convertStrToDate(this.serverData.low2.date_to).getDate() + 1
            )
          )
        }
      },
      hiddenBlocks: {
        peopleChoice: false,
        roomChoice: false
      }
    };
  },
  props: {
    serverData: Object
  },
  created() {},
  computed: {
    childLimit() {
      return this.adults * 3;
    },
    freeChilds() {
      return this.childLimit - (this.childs512 + this.childs05);
    },
    adultRus() {
      if (this.adults == 1) {
        return "взрослый";
      } else return "взрослых";
    },
    child512Rus() {
      if (this.childs512 == 1) {
        return "ребёнок";
      } else return "детей";
    },
    child05Rus() {
      if (this.childs05 == 1) {
        return "ребёнок";
      } else return "детей";
    },
    roomTypeRus() {
      const type =
        this.roomType === "econom"
          ? "Эконом"
          : this.roomType === "standart"
          ? "Стандарт"
          : "Люкс";
      return type;
	},
	// 2 функции ниже для отображения корректной фразы на русском с результатом для клиента
    totalPeople() {
      const people = this.adults + this.childs512 + this.childs05;
      if (people === 1) {
        return "1 человека";
      } else return `${people} человек`;
    },
    daysPeriod() {
      const monthes = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
      ];
      const firstDay = this.dates.dateStart.getDate();
      const lastDay = this.dates.dateEnd.getDate();
      const firstMonth = this.dates.dateStart.getMonth();
      const lastMonth = this.dates.dateEnd.getMonth();

      return `с ${firstDay} ${monthes[firstMonth]} по ${lastDay} ${monthes[lastMonth]}`;
    }
  },
  methods: {
    calculate() {
      this.totalSum = 0;
	  this.errorsCount = 0;
	  // валидируем ошибки
      for (let i in this.errors) {
        this.errors[i] = false;
      }
      if (!this.roomType) {
        this.errors.roomType = true;
        this.errorsCount++;
      }
      if (!this.dates.dateStart) {
        this.errors.dateStart = true;
        this.errorsCount++;
      }
      if (!this.dates.dateEnd) {
        this.errors.dateEnd = true;
        this.errorsCount++;
	  }
	//   ошибок нет, считаем стоимость
      if (this.errorsCount === 0) {
        const days = getDaysArray(this.dates.dateStart, this.dates.dateEnd);
        const highFromDate = this.convertStrToDate(
          this.serverData.high.date_from
        ).getTime();
        const highToDate = this.convertStrToDate(
          this.serverData.high.date_to
        ).getTime();

        function returnPeriod(day) {
          const period =
            day < highFromDate ? "low" : day > highToDate ? "low2" : "high";
          return period;
        }

        function returnDayCost(per, roomType) {
          const daySum = 0;
          let cost = null;
          for (let j in per) {
            if (j == roomType) cost = per[j];
          }
          return cost;
        }

        const periods = days.map(day => returnPeriod(day));
        periods.forEach(per => {
          for (let i in this.serverData) {
            if (i == per) {
              const cost = returnDayCost(this.serverData[i], this.roomType);
              const dayCost =
                this.adults * cost +
                this.childs512 *
                  (cost - cost *
                  (this.serverData[i].child_discount_perc / 100));
              this.totalSum += dayCost;
            }
          }
        });
        this.showTotalSum = true;
        this.$emit("show-step-two");

		// записываем корректуню информацию в объект и кидаём её в стор для дальнейшей отправки на сервер
        const hotelInfo = {
          adults: this.adults,
          childs512: this.childs512,
          childs05: this.childs05,
          roomType: this.roomType,
          dateStart: this.dates.dateStart.toLocaleString(),
          dateEnd: this.dates.dateEnd.toLocaleString()
		};
		this.$store.commit('setHotelInfo', hotelInfo);
      }
    },
    convertStrToDate(str) {
      const dateArr = str.split(".").map(e => +e);
      const date = "2019, " + dateArr[1] + ", " + dateArr[0];
      return new Date(date);
    },
    changeAdults(val) {
      this.showTotalSum = false;
      this.adults = val;
    },
    changeChilds512(val) {
      this.showTotalSum = false;
      this.childs512 = val;
    },
    changeChilds05(val) {
      this.childs05 = val;
	},
	// закрывает раскрытые блоки с выбором людей/комнаты
    hideBlocks() {
      for (let i in this.hiddenBlocks) {
        this.hiddenBlocks[i] = false;
      }
    },
    showPeopleChoice() {
      if (this.hiddenBlocks.peopleChoice) {
        this.hideBlocks();
      } else {
        this.hideBlocks();
        this.hiddenBlocks.peopleChoice = true;
      }
    },
    showRoomChoice() {
      if (this.hiddenBlocks.roomChoice) {
        this.hideBlocks();
      } else {
        this.hideBlocks();
        this.hiddenBlocks.roomChoice = true;
      }
    },
    showDatepicker() {
      this.hideBlocks();
    },
    setDateStart() {
      this.errors.dateStart = false;
	  this.showTotalSum = false;
	  // без таймаута не успевают измениться данные и вылазит ошибка
      setTimeout(() => {
        this.dates.disabledDatesEnd.to = this.dates.dateStart;
        if (
          this.dates.dateEnd &&
          this.dates.dateStart.getTime() > this.dates.dateEnd.getTime()
        ) {
          this.dates.dateEnd = null;
        }
      }, 100);
    },
    setDateEnd() {
      this.showTotalSum = false;
      this.errors.dateEnd = false;
    }
  },
  watch: {
    roomType: function() {
      this.errors.roomType = false;
      this.showTotalSum = false;
    }
  },
  components: {
    PeopleChoice,
    Datepicker
  }
};
</script>

<style lang="scss">
.step-one-wrapper {
  margin-bottom: 40px;
}
.step-one-inner {
  display: flex;
  border-radius: 8px;
  border: 3px solid rgb(90, 90, 230);
  margin-bottom: 15px;
}
.people {
  display: flex;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  font-size: 15px;
  padding: 15px;
  padding-left: 25px;
}
.people-block {
  &:first-child {
    padding-left: 0;
  }
  &__value {
    font-weight: 700;
  }
}
.people-wrapper {
  position: relative;
  width: 400px;
  border-right: 3px solid rgb(90, 90, 230);
  flex-shrink: 0;
}
.people-choice-wrapper {
  position: absolute;
  top: calc(100% + 20px);
  left: 0;
  box-shadow: 0px 0px 5px 3px rgba(90, 90, 230, 0.62);
  width: 100%;
  padding: 10px 15px;
  z-index: 10;
  background-color: #fff;
}
.people-choice {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
.room-wrapper {
  position: relative;
  flex-grow: 1;
  border-right: 3px solid rgb(90, 90, 230);
}
.room {
  padding: 15px;
  cursor: pointer;
  user-select: none;
  font-size: 15px;
}
.room-choice-wrapper {
  position: absolute;
  top: calc(100% + 20px);
  left: 0;
  box-shadow: 0px 0px 5px 3px rgba(90, 90, 230, 0.62);
  width: 100%;
  padding: 10px 15px;
  z-index: 10;
  background-color: #fff;
}
.room-choice {
  display: block;
  padding: 10px 0;
  user-select: none;
  &__input {
    display: none;
    &:checked + span:after {
      content: "";
      display: block;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: rgb(90, 90, 230);
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  &__text {
    position: relative;
    padding-left: 25px;
    &:before {
      content: "";
      display: block;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      border: 1px solid rgb(90, 90, 230);
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
.dates-wrapper {
  display: flex;
  width: 300px;
}
.date-wrapper {
  width: 50%;
  position: relative;
  &__title {
    position: absolute;
    top: 0;
    left: 15px;
    pointer-events: none;
    z-index: 20;
  }
  &_br {
    border-right: 3px solid rgb(90, 90, 230);
  }
}
.datepicker-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  & > div:first-child {
    height: 100%;
  }
}
.datepicker-calendar {
  top: calc(100% + 20px);
  box-shadow: 0px 0px 5px 3px rgba(90, 90, 230, 0.62);
  &_end {
    right: 0;
  }
}
.datepicker-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 20px 0 0 15px;
  background-color: transparent;
}
.step-one-button {
  button {
    padding: 10px 15px;
    outline: none;
    cursor: pointer;
    background-color: rgb(90, 90, 230);
    color: #fff;
    font-weight: 700;
    border: none;
    border-radius: 5px;
  }
}
.step-one-errors {
  font-weight: 300;
  font-style: italic;
  color: rgb(231, 20, 20);
}
.error-focus {
  background-color: rgba(230, 92, 92, 0.21);
}
@media screen and (max-width: 780px) {
	.step-one-inner {
		flex-direction: column;
	}
	.people-wrapper {
		width: 100%;
		border-right: none;
	}
	.room-wrapper {
		width: 100%;
		border-right: none;
		border-top: 3px solid rgb(90, 90, 230);
		border-bottom: 3px solid rgb(90, 90, 230);
	}
	.dates-wrapper {
		width: 100%;
	}
	.people-choice-wrapper {
		top: 100%;
		z-index: 30;
	}
	.room-choice-wrapper {
		top: 100%;
		z-index: 30;
	}
}
@media screen and (max-width: 500px) {
	.people {
		flex-direction: column;
	}
	.people-block {
		padding: 10px 0;
	}
}
</style>
